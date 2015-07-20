using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public abstract class BaseGameHandler : IMessageHandler
{
    protected GameController Controller;

    public BaseGameHandler(GameController controller)
    {
        Controller = controller;
    }

    public string GetErrorMessage(JSONObject json)
    {
        if (json.HasField(((int) ParameterCode.Error).ToString()))
        {
            return json.GetField(((int) ParameterCode.Error).ToString()).str;
        }
        return null;
    }

    public abstract MessageCode MessageCode { get; }

    public abstract void HandleMessage(JSONObject message);
}
