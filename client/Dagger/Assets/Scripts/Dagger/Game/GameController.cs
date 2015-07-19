using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Assets.Scripts.Dagger.Login.Handlers;

public class GameController : MonoBehaviour, IMessageListener
{
    public IConnectionController Connection;

    public Player Player;
    public EntityManager EntityManager;

    public Dictionary<MessageCode, IMessageHandler> Handlers;

    void Awake()
    {
        Handlers = new Dictionary<MessageCode, IMessageHandler>();
        AddHandler(new ShowObjectsHandler(this));
    }

	// Use this for initialization
	void Start () {
        Connection = FindObjectOfType<ConnectionController>();

        if (Connection == null || !Connection.IsConnected)
        {
            Application.LoadLevel("login");
            return;
        }

        var gatewayConnectionListener = new GenericConnectionListener(UpdateConnectionStatus);
        gatewayConnectionListener.SetMessageListener(this);
        Connection.SetConnectionListener(gatewayConnectionListener);

        DontDestroyOnLoad(this);
	    DontDestroyOnLoad(Player);

        // Setup player
	    Player.transform.position = PersistentData.ZoneLoadData.PlayerPosition;

        Application.LoadLevel("world");
        Connection.SendMessage(MessageCode.PlayerInGame, new JSONObject());
    }

    void UpdateConnectionStatus()
    {
    }


    void AddHandler(IMessageHandler handler)
    {
        Handlers.Add(handler.MessageCode, handler);
    }
	
	// Update is called once per frame
	void Update () {
	
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

}
