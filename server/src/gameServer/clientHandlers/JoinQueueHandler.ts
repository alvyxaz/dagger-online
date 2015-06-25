/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import GClientMessageHandler = require('../interfaces/GClientMessageHandler');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import MessageCode = require('../../common/MessageCode');
import GameServer = require('../GameServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');
import User = require('../models/User');

class JoinQueueHandler extends GClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.JoinQueue;
    }

    handleClient(message: Object, user: User) {
        var username: string = message['username'];

        console.log("GOT MESSAGE: ".cyan);
        console.log(message);
    }

}

export = JoinQueueHandler;