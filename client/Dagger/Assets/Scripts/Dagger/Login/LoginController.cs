using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using Assets.Scripts.Dagger.Login.Handlers;
using UnityEngine;
using UnityEngine.UI;

public class LoginController : MonoBehaviour, IMessageListener
{
    public IConnectionController Connection;

    public Text ConnectionStatus;

    public LoginPanel LoginPanel;
    public RegisterPanel RegisterPanel;

    public Dictionary<MessageCode, IMessageHandler> Handlers;

    public ServerSelection ServerSelection;

    private bool _isRegisteredToConnector;
    public string ConnectorKey { get; set; }

    public string GatewayAddress = "ws://127.0.0.1:2999";

    void Awake()
    {
        Handlers = new Dictionary<MessageCode, IMessageHandler>();
        AddHandler(new AssignConnectorHandler(this));
        AddHandler(new CredentialsRequestHandler(this));
    }

    void Start()
    {
        // Test
        Connection = FindObjectOfType<ConnectionController>();
        Debug.Log(Connection);
        var gatewayConnectionListener = new GenericConnectionListener(UpdateConnectionStatus);
        Connection.SetConnectionListener(gatewayConnectionListener);
        gatewayConnectionListener.SetMessageListener(this);

        if (!ConnectToLastServer())
        {
            ConnectTo("ws://127.0.0.1:2999");
        }

        UpdateConnectionStatus();
    }

    public void ConnectToConnector(string address, string key)
    {
        ConnectorKey = key;
        Disconnect();
        ConnectTo(address);
    }

    void UpdateConnectionStatus()
    {
        if (Connection.IsConnected)
        {
            ConnectionStatus.text = "Online";
            ConnectionStatus.color = Color.green;
        }
        else
        {
            ConnectionStatus.text = "Offline";
            ConnectionStatus.color = Color.red;
        }
    }

    public void OnRegisterClick()
    {
        if (RegisterPanel.IsValid())
        {
            var json = new JSONObject();
            json.AddField("username", RegisterPanel.Username.text);
            json.AddField("password", RegisterPanel.Password.text);
            json.AddField("email", RegisterPanel.Email.text);
            Connection.SendMessage(MessageCode.Register, json);
        }
    }

    public void OnLoginClick()
    {
        if (LoginPanel.IsValid())
        {
            var json = new JSONObject();
            json.AddField("username", LoginPanel.Username.text);
            json.AddField("password", LoginPanel.Password.text);
            Connection.SendMessage(MessageCode.Login, json, m =>
            {
                var servers = m;
                if (servers != null)
                {
                    var serverStrings = servers.list.Select(s => s.GetField("name").str);
                    ServerSelection.Display(serverStrings);
                }
                else
                {
                    Debug.LogWarning("Failed to parse a list of servers");
                }
            });
        }
    }

    void AddHandler(IMessageHandler handler)
    {
        Handlers.Add(handler.MessageCode, handler);
    }

    public void Disconnect()
    {
        Connection.Disconnect();
    }

    public void ConnectTo(string address)
    {
        Connection.ConnectTo(address);
    }

    public void OnMessageReceived(JSONObject message)
    {
        try
        {
            var key = Convert.ToInt32(message.GetField("o").ToString());

            if (Handlers.ContainsKey((MessageCode)key))
            {
                Handlers[(MessageCode)key].HandleMessage(message);
            }
            else
            {
                Debug.LogWarning("Couldn't find handler for: " + key);
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Failed to handle a packet");
        }
        
    }

    public bool ConnectToLastServer()
    {
        if (PlayerPrefs.HasKey("credentials"))
        {
            var data = PlayerPrefs.GetString("credentials");
            var jsonData = JSONObject.Create(data);

            var key = jsonData.GetField("key").str;
            var address = jsonData.GetField("address").str;

            //Disconnect();
            ConnectorKey = key;
            Connection.ConnectTo(address);
            return true;
        }
        return false;
    }

    public void ConnectToGateway()
    {
        Debug.Log("Trying to connect to gateway");
        Connection.ConnectTo(GatewayAddress);
    }
}
