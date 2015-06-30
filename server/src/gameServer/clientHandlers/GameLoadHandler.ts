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

class GameLoadHandler extends GClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.GameLoad;
    }

    handleClientAck(message: Object, user: User, ackCallback? : (data: Object) => void) : Object {
        console.log("Did try");
        return {};
    }

}

export = GameLoadHandler;