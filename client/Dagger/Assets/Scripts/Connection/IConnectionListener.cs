using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public interface IConnectionListener
{
    void OnConnected();
    void OnDisconnected();
    IMessageListener MessageListener { get; }
    void SetMessageListener(IMessageListener messageListener);
}
