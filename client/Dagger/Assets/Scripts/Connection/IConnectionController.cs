using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public interface IConnectionController
{
    bool IsConnected { get; }
    void ConnectTo(string address);
    void Disconnect();
    void SendMessage(MessageCode code, JSONObject data, Action<JSONObject> ackCallback = null);
    void SetConnectionListener(IConnectionListener listener);
}
