using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using SocketIO;
using WebSocketSharp;

public class ConnectionController : MonoBehaviour, IConnectionController
{
    public delegate void StatusChangeHandler();

    public event StatusChangeHandler OnConnect;
    public event StatusChangeHandler OnDisconnect;

    private SocketIOConnection _socket;

    public static ConnectionController Instance;

    private IMessageListener _messageListener;
    private IConnectionListener _connectionListener;

    public void SetMessageListener(IMessageListener listener)
    {
        _messageListener = listener;
    }

    void Awake()
    {
        _socket = GetComponent<SocketIOConnection>();
        Instance = this;
    }

	// Use this for initialization
	void Start ()
	{
        DontDestroyOnLoad(this);

        _socket.On("connect", @event =>
        {
            if (_connectionListener != null)
            {
                _connectionListener.OnConnected();
            }
            //OnConnected();
        });

        _socket.On("disconnect", @event =>
        {
            if (_connectionListener != null)
            {
                _connectionListener.OnDisconnected();
            }
            //OnDisconnected();
        });

        _socket.On("message", OnMessage);

        //_socket.On("error", @event =>
        //{
        //    Debug.Log("Error");
        //});
        //_socket.On("close", @event =>
        //{
        //    OnDisconnected();
        //});

        //_socket.Connect();
    }

    public bool IsConnected
    {
        get { return _socket.IsConnected; }
    }

    public void ConnectTo(string address)
    {
        Debug.Log("Connecting to: " + address);

        _socket.Connect(address + "/socket.io/?EIO=3&transport=websocket");
    }

    public void Disconnect()
    {
        _socket.Close();
    }

    public void SendMessage(MessageCode code, JSONObject data, Action<JSONObject> ack = null)
    {
        if (data != null)
        {
            if (!_socket.IsConnected)
            {
                Debug.LogError("Not connected to server");
                return;
            }
            
            data.AddField("o", (int)code);
            if (ack != null)
            {
                _socket.Emit("message", data, ack);
            }
            else
            {
                _socket.Emit("message", data);
            }
        }
    }

    public void SetConnectionListener(IConnectionListener listener)
    {
        _connectionListener = listener;
    }

    void OnMessage(SocketIOEvent e)
    {
        if (_connectionListener != null && _connectionListener.MessageListener != null)
        {
            _connectionListener.MessageListener.OnMessageReceived(e.data);
        }
    }

    void OnConnected()
    {
        if (OnConnect != null)
        {
            OnConnect();
        }
    }

    void OnDisconnected()
    {
        if (OnDisconnect != null)
        {
            OnDisconnect();
        }
    }	

	// Update is called once per frame
	void Update () {
	
	}
}
