using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using UnityEngine;

public class ShowObjectsHandler : BaseGameHandler
{
    public ShowObjectsHandler(GameController controller) : base(controller)
    {
    }

    public override MessageCode MessageCode
    {
        get { return MessageCode.ShowObjects; }
    }

    public override void HandleMessage(JSONObject message)
    {
        Debug.Log("Show Objects handler works!!!!");
        var json = new JSONObject();
    }
}
