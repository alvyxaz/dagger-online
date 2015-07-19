/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />
import _ = require('lodash');

import GClientMessageHandler = require('../interfaces/GClientMessageHandler');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
import MessageCode = require('../../common/MessageCode');
import GameServer = require('../GameServer');
import Sockets = require('../../core/connections/Sockets');
import ParameterCode = require('../../common/ParameterCode');
import User = require('../models/User');
import Player = require('../models/Player');
import GameObject = require('../models/GameObject');
import Position = require('../models/Position');
import Zone = require('../models/Zone');

// Database stuff
import Models = require('../../database/Models');

class PlayerInGame extends GClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.PlayerInGame;
    }

    handleClient(message: Object, user: User)  {
        var player = user.currentPlayer
        if (!player) {
            return;
        }

        var data = user.getData(SubServerParameterCode.LoginZone);

        if (!data) {
            return;
        }

        var zone = data['zone'];
        var position = data['position'];

        zone.addPlayer(player, new Position(position[0], position[1]));

        player.isInGame = true;
    }

}

export = PlayerInGame;