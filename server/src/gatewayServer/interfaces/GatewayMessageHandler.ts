/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types.ts' />

import MessageHandler = require('../../core/messages/MessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import ParameterCode = require('../../common/ParameterCode');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import GatewayServer = require('../GatewayServer');
import Sockets = require('../../core/connections/Sockets');

class GatewayMessageHandler implements MessageHandler<SubServerMessageCode, Object>{
    public server : GatewayServer;

    constructor(server : GatewayServer) {
        this.server = server;
    }

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.NoHandler;
    }

    handle(message: Object, sender: Sockets.Socket) : boolean {
        console.log(('Gateway: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    }

    handleAck(message: Object, sender: Sockets.Socket, ackCallback? : (data: Object) => void) : Object {
        console.log(('Gateway: Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    }

    generateErrorResponse(message: string) : Object {
        var response = {};
        response[ParameterCode.Error] = message;
        return response;
    }
}

export = GatewayMessageHandler;