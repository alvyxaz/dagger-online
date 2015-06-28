/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types.ts' />

import MessageHandler = require('../../core/messages/MessageHandler');
import ParameterCode = require('../../common/ParameterCode');
import MessageCode = require('../../common/MessageCode');
import GatewayServer = require('../GatewayServer');
import Sockets = require('../../core/connections/Sockets');

class ClientMessageHandler implements MessageHandler<MessageCode, Object>{
    public server : GatewayServer;

    constructor(server : GatewayServer) {
        this.server = server;
    }

    getMessageType() : MessageCode {
        throw Error("getMessageType() not implemented");
    }

    handle(message: Object, sender: Sockets.Socket) : boolean {
        console.log(('Gateway: Client Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    }

    handleAck(message: Object, sender: Sockets.Socket, callback? : (data: Object) => void) : Object {
        console.log(('Gateway: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    }

    generateErrorResponse(message: string) : Object {
        var response = {};
        response[ParameterCode.Error] = message;
        return response;
    }
}

export = ClientMessageHandler;