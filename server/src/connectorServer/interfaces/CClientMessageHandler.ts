/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import MessageHandler = require('../../core/messages/MessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import MessageCode = require('../../common/MessageCode');
import ConnectorServer = require('../ConnectorServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');

class CClientMessageHandler implements MessageHandler<MessageCode, Object>{
    protected server : ConnectorServer;

    constructor(server : ConnectorServer) {
        this.server = server;
    }

    getMessageType() : MessageCode {
        return MessageCode.Error;
    }

    handle(message: Object, sender: Sockets.Socket) : boolean {
        console.log(('Connector: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    }

    handleAck(message: Object, sender: Sockets.Socket,  ackCallback? : (data: Object) => void) : Object {
        console.log(('Connector: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    }

    generateErrorResponse(message: string) : Object {
        var response = {};
        response[ParameterCode.Error] = message;
        return response;
    }
}

export = CClientMessageHandler;