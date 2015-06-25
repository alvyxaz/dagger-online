#define SOCKET_IO_DEBUG

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading;
using UnityEngine;
using WebSocketSharp;

namespace SocketIO
{
    public class SocketIOConnection : MonoBehaviour
    {
        public float AckExpirationTime = 30f;
        public int ReconnectDelay = 2000; // ms
        public float PingInterval = 25f;
        public float PingTimeout = 60f;

        public string Sid { get; set; }

        private object _eventQueueLock;
        private Queue<SocketIOEvent> _eventQueue; 

        private object _ackQueueLock;
        private Queue<Packet> _ackQueue;

        private Dictionary<string, List<Action<SocketIOEvent>>> _handlers;
        private List<Ack> _ackList;
        private int _packetId;

        private WebSocket _ws;
        private bool _isWsConnected;

        private Encoder _encoder;
        private Decoder _decoder;
        private Parser _parser;

        private WebSocketWorker _socketWorker;
        private WebSocketWorker _pingWorker;

        #if SOCKET_IO_DEBUG
        public Action<string> _debugMethod;
        #endif

        public bool IsConnected { get { return _isWsConnected; } }

        void Awake()
        {
            _encoder = new Encoder();
            _decoder = new Decoder();
            _parser = new Parser();
            _handlers = new Dictionary<string, List<Action<SocketIOEvent>>>();
            _ackList = new List<Ack>();
            _packetId = 0;

            _eventQueueLock = new object();
            _eventQueue = new Queue<SocketIOEvent>();

            _ackQueueLock = new object();
            _ackQueue = new Queue<Packet>();

            #if SOCKET_IO_DEBUG
            if (_debugMethod == null) { _debugMethod = Debug.Log; };
            #endif
        }

        public void Connect(string url)
        {
            DisposeCurrentConnection();

            if (IsConnected)
            {
                Close();
            }

            var ws = new WebSocket(url);
            ws = new WebSocket(url);
            ws.OnOpen += OnOpen;
            ws.OnMessage += OnMessage;
            ws.OnError += OnError;
            ws.OnClose += OnClose;
            _isWsConnected = false;

            _socketWorker = new WebSocketWorker(ws, RunSocketThread);
            _socketWorker.Start();

            _pingWorker = new WebSocketWorker(ws, RunPingThread);
            _pingWorker.Start();
        
            _ws = ws;
        }

        public void DisposeCurrentConnection()
        {
            if (_ws != null)
            {
                _ws.Close();
                _ws.OnOpen -= OnOpen;
                _ws.OnMessage -= OnMessage;
                _ws.OnError -= OnError;
                _ws.OnClose -= OnClose;
                _isWsConnected = false;
            }

            StopWorkers();
        }

        public void Update()
        {
            // Update connection status
            if (_ws != null)
            {
                // If we have websocket created
                if (_isWsConnected != _ws.IsConnected)
                {
                    // Connection Status changed. Notify an event about it
                    _isWsConnected = _ws.IsConnected;
                    EmitEvent(_isWsConnected ? "connect" : "disconnect");
                }
            }

            // Fire events from poll
            lock (_eventQueueLock)
            {
                while (_eventQueue.Count > 0)
                {
                    EmitEvent(_eventQueue.Dequeue());
                }
            }

            // Fire acks from poll
            lock (_ackQueueLock)
            {
                while (_ackQueue.Count > 0)
                {
                    InvokeAck(_ackQueue.Dequeue());
                }
            }


            // Remove expired acks
            if (_ackList.Count > 0 && DateTime.Now.Subtract(_ackList[0].time).TotalSeconds > AckExpirationTime)
            {
                _ackList.RemoveAt(0);
            }
        }

        private void RunSocketThread(WebSocketWorker worker)
        {
            WebSocket webSocket = worker.WebSocket;
            while (worker.IsRunning)
            {
                if (webSocket.IsConnected)
                {
                    Thread.Sleep(ReconnectDelay);
                }
                else
                {
                    // This causes auto 
                    webSocket.Connect();
                }
            }
            webSocket.Close();
        }

        private void RunPingThread(WebSocketWorker worker)
        {
            WebSocket webSocket = worker.WebSocket;

            int timeoutMilis = Mathf.FloorToInt(PingTimeout * 1000);
            int intervalMilis = Mathf.FloorToInt(PingInterval * 1000);

            DateTime pingStart;

            while (worker.IsRunning)
            {
                if (!webSocket.IsConnected)
                {
                    Thread.Sleep(ReconnectDelay);
                }
                else
                {
                    // TODO handle pong
                    EmitPacket(new Packet(EnginePacketType.PING));
                    pingStart = DateTime.Now;

                    //while (webSocket.IsConnected && thPinging && (DateTime.Now.Subtract(pingStart).TotalSeconds < timeoutMilis))
                    //{
                    //    Thread.Sleep(200);
                    //}

                    //if (!thPong)
                    //{
                    //    webSocket.Close();
                    //}

                    Thread.Sleep(intervalMilis);
                }
            }
        }

        private void OnError(object sender, ErrorEventArgs e)
        {
            EmitEvent(new SocketIOEvent("error", JSONObject.CreateStringObject(e.Message)));
        }

        private void OnClose(object sender, CloseEventArgs e)
        {
            EmitEvent("close");
        }

        private void OnOpen(object sender, EventArgs e)
        {
            EmitEvent("open");
        }


        private void OnMessage(object sender, MessageEventArgs e)
        {
            #if SOCKET_IO_DEBUG
            _debugMethod.Invoke("[SocketIO] Raw message: " + e.Data);
            #endif
            Packet packet = _decoder.Decode(e);

            switch (packet.enginePacketType)
            {
                case EnginePacketType.OPEN: HandleOpen(packet); break;
                case EnginePacketType.CLOSE: EmitEvent("close"); break;
                case EnginePacketType.PING: HandlePing(); break;
                case EnginePacketType.PONG: HandlePong(); break;
                case EnginePacketType.MESSAGE: HandleMessage(packet); break;
            }
        }

        private void HandleOpen(Packet packet)
        {
            #if SOCKET_IO_DEBUG
            _debugMethod.Invoke("[SocketIO] Socket.IO sid: " + packet.json["sid"].str);
            #endif
            Sid = packet.json["sid"].str;
            EmitEvent("open");
        }

        private void HandlePing()
        {
            EmitPacket(new Packet(EnginePacketType.PONG));
        }

        private void HandlePong()
        {
        }

        private void HandleMessage(Packet packet)
        {
            if (packet.json == null) { return; }

            if (packet.socketPacketType == SocketPacketType.ACK)
            {
                if (_ackList.Any(t => t.packetId == packet.id))
                {
                    // Packet received is an ack we're waiting for
                    lock (_ackQueueLock)
                    {
                        _ackQueue.Enqueue(packet);
                    }
                    return;
                }

                #if SOCKET_IO_DEBUG
                _debugMethod.Invoke("[SocketIO] Ack received for invalid Action: " + packet.id +", List length: " + _ackList.Count);
                #endif
            }

            if (packet.socketPacketType == SocketPacketType.EVENT)
            {
                try
                {
                    SocketIOEvent e = _parser.Parse(packet.json);
                    lock (_eventQueueLock)
                    {
                        _eventQueue.Enqueue(e);
                    }
                }
                catch (Exception exc)
                {
                    Debug.Log("Failed to parse a message: " + packet.json);
                    Debug.Log(exc.Message);
                }
            }
        }

        public void On(string ev, Action<SocketIOEvent> callback)
        {
            if (!_handlers.ContainsKey(ev))
            {
                _handlers[ev] = new List<Action<SocketIOEvent>>();
            }
            _handlers[ev].Add(callback);
        }

        public void Off(string ev, Action<SocketIOEvent> callback)
        {
            if (!_handlers.ContainsKey(ev))
            {
                #if SOCKET_IO_DEBUG
                _debugMethod.Invoke("[SocketIO] No callbacks registered for event: " + ev);
                #endif
                return;
            }

            List<Action<SocketIOEvent>> l = _handlers[ev];
            if (!l.Contains(callback))
            {
                #if SOCKET_IO_DEBUG
                _debugMethod.Invoke("[SocketIO] Couldn't remove callback action for event: " + ev);
                #endif
                return;
            }

            l.Remove(callback);
            if (l.Count == 0)
            {
                _handlers.Remove(ev);
            }
        }

        public void OnDestroy()
        {
            StopWorkers();
        }

        private void StopWorkers()
        {
            if (_pingWorker != null)
            {
                _pingWorker.Stop();
                _pingWorker = null;
            }

            if (_socketWorker != null)
            {
                _socketWorker.Stop();
                _socketWorker = null;
            }
        }

        public void OnApplicationQuit()
        {
            Close();
        }

        public void Close()
        {
            EmitClose();
            StopWorkers();
            _ws.Close();
        }

        public void Emit(string ev, JSONObject data)
        {
            EmitMessage(-1, string.Format("[\"{0}\",{1}]", ev, data));
        }

        public void Emit(string ev, JSONObject data, Action<JSONObject> action)
        {
            EmitMessage(++_packetId, string.Format("[\"{0}\",{1}]", ev, data));
            _ackList.Add(new Ack(_packetId, action));
        }

        /// <summary>
        /// Unity thread safe
        /// </summary>
        /// <param name="packet"></param>
        private void InvokeAck(Packet packet)
        {
            foreach (var ack in _ackList)
            {
                if (ack.packetId != packet.id)
                {
                    // Ignore 
                    continue;
                }
                _ackList.Remove(ack);
                ack.Invoke(packet.json.list[0]);
                return;
            }
        }

        private void EmitClose()
        {
            EmitPacket(new Packet(EnginePacketType.MESSAGE, SocketPacketType.DISCONNECT, 0, "/", -1, new JSONObject("")));
            EmitPacket(new Packet(EnginePacketType.CLOSE));
        }

        private void EmitMessage(int id, string raw)
        {
            EmitPacket(new Packet(EnginePacketType.MESSAGE, SocketPacketType.EVENT, 0, "/", id, new JSONObject(raw)));
        }

        public void EmitEvent(string type)
        {
            EmitEvent(new SocketIOEvent(type));
        }

        /// <summary>
        /// Unity thread safe
        /// </summary>
        /// <param name="ev"></param>
        public void EmitEvent(SocketIOEvent ev)
        {
            if (!_handlers.ContainsKey(ev.name))
            {
                return;
            }

            foreach (Action<SocketIOEvent> handler in _handlers[ev.name])
            {
                try
                {
                    handler(ev);
                }
                catch (Exception e)
                {
                    #if SOCKET_IO_DEBUG
                    _debugMethod.Invoke(e.ToString());
                    #endif
                }
            }
        }

        private void EmitPacket(Packet packet)
        {
            #if SOCKET_IO_DEBUG
            _debugMethod.Invoke("[SocketIO] " + packet);
            #endif

            try
            {
                _ws.Send(_encoder.Encode(packet));
            }
            catch (SocketIOException ex)
            {
                #if SOCKET_IO_DEBUG
                _debugMethod.Invoke(ex.ToString());
                #endif
            }
        }
    }

    public class WebSocketWorker
    {
        private volatile bool _isRunning = true;
        private WebSocket _ws;
        private Action<WebSocketWorker> _action;

        public bool IsRunning {get {return _isRunning;}}
        public WebSocket WebSocket { get { return _ws; } }

        public WebSocketWorker(WebSocket socket, Action<WebSocketWorker> action)
        {
            _ws = socket;
            _action = action;
        }

        public void Start()
        {
            _isRunning = true;
            var thread = new Thread(DoWork);
            thread.Start();
        }

        private void DoWork()
        {
            _action(this);
        }

        public void Stop()
        {
            _isRunning = false;
        }
    }
}


