/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import MessageHandler = require('../../core/messages/MessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import MessageCode = require('../../common/MessageCode');
import GameServer = require('../GameServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');

import User = require('../models/User');

class GClientMessageHandler implements MessageHandler<MessageCode, Object>{
    protected server : GameServer;

    constructor(server : GameServer) {
        this.server = server;
    }

    getMessageType() : MessageCode {
        return MessageCode.Error;
    }

    handleClient(message: Object, user: User) {
    }

    handleClientAck(message: Object, user: User, ackCallback? : (data: Object) => void) : Object {
        return {};
    }

    handle(message: Object, sender: Sockets.Socket) : boolean {
        var user = this.server.getUser(message['c']);
        if (user && user.isConnected()) {
            this.handleClient(message, user);
            return true;
        }
        console.log(('GS: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    }

    handleAck(message: Object, sender: Sockets.Socket,  ackCallback? : (data: Object) => void) : Object {
        var user = this.server.getUser(message['c']);
        if (user && user.isConnected()) {
            return this.handleClientAck(message, user, ackCallback);
        }
        console.log(('GS: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    }

    generateErrorResponse(message: string) : Object {
        var response = {};
        response[ParameterCode.Error] = message;
        return response;
    }
}

export = GClientMessageHandler;