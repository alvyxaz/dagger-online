using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Dagger.Login.Handlers
{
    public class CredentialsRequestHandler : BaseLoginHandler
    {
        public CredentialsRequestHandler(LoginController controller) : base(controller)
        {
        }

        public override MessageCode MessageCode
        {
            get { return MessageCode.CredentialsRequest; }
        }

        public override void HandleMessage(JSONObject message)
        {
            var json = new JSONObject();
            json.AddField("key", Controller.ConnectorKey);
            Controller.Connection.SendMessage(MessageCode.CredentialsRequest, json, o =>
            {
                if (GetErrorMessage(o) != null)
                {
                    Debug.LogWarning(GetErrorMessage(o));
                    Controller.ConnectToGateway();
                    return;
                }

                // Successfully logged in to game
                Application.LoadLevel("loading");
            });
        }
    }
}
