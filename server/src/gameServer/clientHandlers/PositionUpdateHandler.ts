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
import Player = require('../models/Player');
import Position = require('../models/Position');
import Zone = require('../models/Zone');

// Database stuff
import Models = require('../../database/Models');

class GameLoadHandler extends GClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.PositionUpdate;
    }

    handleClient(message: Object, user: User)  {
        var player = user.currentPlayer
        if (!player || !player.zone) {
            return;
        }

        var zone = player.zone;
        var posData = message['pos'];
        zone.setObjectPosition(player, posData[0], posData[1]);
    }

}

export = GameLoadHandler;