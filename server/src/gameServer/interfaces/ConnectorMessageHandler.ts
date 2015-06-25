/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import MessageHandler = require('../../core/messages/MessageHandler');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import GameServer = require('../GameServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');

class ConnectorMessageHandler implements MessageHandler<SubServerMessageCode, Object>{
    protected server : GameServer;

    constructor(server : GameServer) {
        this.server = server;
    }

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.Error;
    }

    handle(message: Object, sender: Sockets.Socket) : boolean {
        console.log(('GameServer: Connector Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    }

    handleAck(message: Object, sender: Sockets.Socket,  ackCallback? : (data: Object) => void) : Object {
        console.log(('GameServer: Connector Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    }

    generateErrorResponse(message: string) : Object {
        var response = {};
        response[ParameterCode.Error] = message;
        return response;
    }
}

export = ConnectorMessageHandler;