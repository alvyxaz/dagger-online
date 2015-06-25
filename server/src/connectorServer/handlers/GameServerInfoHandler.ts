/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
import Sockets = require('../../core/connections/Sockets');

class GameServerInfoHandler extends ConnectorMessageHandler{

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.GameServerInfo;
    }

    handle(message: Object, sender : Sockets.Socket) : boolean {
        this.server.gameServerInfo = message[SubServerParameterCode.GameServerInfo];
        this.server.connectToGatewayServer();
        return true;
    }

    handleClient(message: Object, sender: Sockets.Socket) : boolean {
        return true;
    }
}

export = GameServerInfoHandler;