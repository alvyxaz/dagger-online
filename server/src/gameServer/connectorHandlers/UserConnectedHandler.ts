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
        return SubServerMessageCode.UserConnected;
    }

    handleAck(message: Object, sender: Sockets.Socket, ackCallback? : (data: Object) => void) : Object {
        var username: string = message['username'];

        if (username) {
            if (this.server.isUserConnected(username)) {
                console.log("User is already connected to game server: ".red + username);
                return this.generateErrorResponse('User is already connected' + this.getMessageType());;
            }

            var id : number = this.server.connectUser(username, sender);
            ackCallback({
                'id' : id
            });
            return;
        }

        return this.generateErrorResponse('Invalid request , msg: ' + this.getMessageType());
    }
}

export = UserConnectedHandler;