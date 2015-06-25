/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import GatewayMessageHandler = require('../interfaces/GatewayMessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import AvailableConnector = require('../models/AvailableConnector');
import Sockets = require('../../core/connections/Sockets');

class RegisterConnectorHandler extends GatewayMessageHandler{

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.RegisterConnector;
    }

    handle(message: Object, sender : Sockets.Socket) : boolean {
        this.server.addConnector(new AvailableConnector(
            this.server,
            sender,
            message));

        return true;
    }
}

export = RegisterConnectorHandler;