/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import MessageCode = require('../../common/MessageCode');
import GameServer = require('../GameServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');

class UserConnectedHandler extends ConnectorMessageHandler{

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.UserDisconnected;
    }

    handle(message: Object, sender: Sockets.Socket,  ackCallback? : (data: Object) => void) : boolean {
        if (message['id']) {
            this.server.disconnectUser(message['id']);
        } else {
            console.log("Tried to disconenct a user without id")
        }

        return true;
    }
}

export = UserConnectedHandler;