using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class GenericConnectionListener : IConnectionListener
{
    private IMessageListener _messageListener;

    private Action _onConnected;
    private Action _onDisconnected;

    public GenericConnectionListener(Action onStatusChange) 
        :this(onStatusChange, onStatusChange)
    {
    }

    public GenericConnectionListener(Action onConnected, Action onDisconnected)
    {
        _onConnected = onConnected;
        _onDisconnected = onDisconnected;
    }

    public void OnConnected()
    {
        _onConnected();
    }

    public void OnDisconnected()
    {
        _onDisconnected();
    }

    public IMessageListener MessageListener
    {
        get { return _messageListener; }
    }

    public void SetMessageListener(IMessageListener messageListener)
    {
        _messageListener = messageListener;
    }
}
