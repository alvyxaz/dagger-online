using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public class AssignConnectorHandler : BaseLoginHandler
{
    public override MessageCode MessageCode
    {
        get { return MessageCode.AssignConnector; }
    }

    public override void HandleMessage(JSONObject message)
    {
        Controller.Connection.Disconnect();
        Controller.ConnectToConnector(message.GetField("address").str, message.GetField("key").str);
    }

    public AssignConnectorHandler(LoginController controller) : base(controller)
    {
    }
}
