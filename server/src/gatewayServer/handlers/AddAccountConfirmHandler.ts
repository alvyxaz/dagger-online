/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import GatewayMessageHandler = require('../interfaces/GatewayMessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import SocketData = require('../../serverCommon/SocketData');
import MessageCode = require('../../common/MessageCode');
import AvailableConnector = require('../models/AvailableConnector');
import Sockets = require('../../core/connections/Sockets');

class AddAccountConfirmHandler extends GatewayMessageHandler{

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.AddAccount;
    }

    handle(message: Object, sender : Sockets.Socket) : boolean {
        // From connector server
        var username : string = message['username'];
        var key :string = message['key'];

        var account = this.server.getConnectedAccount(username);
        if (account.socket.isConnected()) {
            var connector : AvailableConnector = sender.getData(SocketData.Connector);
            if (!connector) {
                console.log("Connector not found while assigning it to user".red)
            }
            account.socket.sendMessage(MessageCode.AssignConnector, {
                'address' : connector.publicAddress,
                'key' : key
            });
        } else {
            console.log("Account is no longer connected to assign a connector to it".red)
        }

        return true;
    }
}

export = AddAccountConfirmHandler;