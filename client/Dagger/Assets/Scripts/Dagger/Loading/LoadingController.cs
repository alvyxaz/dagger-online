using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEditor.AnimatedValues;
using UnityEngine;

public class LoadingController : MonoBehaviour, IMessageListener
{
    public IConnectionController Connection;

    void Awake()
    {
        
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
            var posData = m.GetField("position");
            var position = new Vector3(
                float.Parse(posData[0].ToString()),
                float.Parse(posData[1].ToString()));

            var loadingData = new ZoneLoadData(position, "Super WOrld", "world");
            PersistentData.ZoneLoadData = loadingData;

            Application.LoadLevel("gameplay");
        });

    }

    public void OnMessageReceived(JSONObject message)
    {
        Debug.Log(message);
    }
}