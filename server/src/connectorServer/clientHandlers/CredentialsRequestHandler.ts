/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import CClientMessageHandler = require('../interfaces/CClientMessageHandler');
import MessageCode = require('../../common/MessageCode');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import Sockets = require('../../core/connections/Sockets');
import SocketData = require('../../serverCommon/SocketData');

class CredentialsRequestHandler extends CClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.CredentialsRequest;
    }

    handleAck(message: Object, sender : Sockets.Socket, ackCallback: (data: Object) => void) : Object {
        var key = message['key'];

        var username: string = this.server.getPassUsername(key);

        if (username) {
            this.server.sendGameserverMessage(SubServerMessageCode.UserConnected, {
                'username' : username
            }, (data: Object) => {
                if (data['id']) {
                    sender.setData(SocketData.UserId, data['id']);
                    sender.setData(SocketData.Username, username);
                    sender.setData(SocketData.IsInGameServer, true);
                    ackCallback({});
                    console.log("Connector linked game server to player: ".yellow + username.cyan);
                    return false;
                } else {
                    ackCallback(this.generateErrorResponse('Invalid request'));
                }
            });
            return false;
        }
        return this.generateErrorResponse('Access denied');
    }
}

export = CredentialsRequestHandler;