using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public abstract class BaseLoginHandler : IMessageHandler
{
    protected LoginController Controller;

    public BaseLoginHandler(LoginController controller)
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
