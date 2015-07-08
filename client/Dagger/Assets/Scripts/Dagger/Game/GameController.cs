using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

class GameController : MonoBehaviour, IMessageListener
{
    public IConnectionController Connection;

    public static GameController Instance;

    void Awake()
    {
        Instance = this;
    }

    void Start()
    {
        Connection = FindObjectOfType<ConnectionController>();

        if (Connection == null || !Connection.IsConnected)
        {
            Application.LoadLevel("login");
            return;
        }

        Connection.SendMessage(MessageCode.GameLoad, new JSONObject(), m =>
        {
            Debug.Log("Loaqding responded");
        });

    }

    public void OnMessageReceived(JSONObject message)
    {
        Debug.Log(message);
    }
}
