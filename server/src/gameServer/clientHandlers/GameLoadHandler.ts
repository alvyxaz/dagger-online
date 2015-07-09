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

// Database stuff
import Models = require('../../database/Models');

class GameLoadHandler extends GClientMessageHandler{

    getMessageType() : MessageCode {
        return MessageCode.GameLoad;
    }

    handleClientAck(message: Object, user: User, ackCallback? : (data: Object) => void) : Object {

        Models.Player.findOne({'username' : user.username}, (err : any, playerData: any) => {
            if (err) {
                ackCallback(this.generateErrorResponse("Invalid player"));
                return console.log("Invalid player lookup");
            }

            var world = this.server.world;

            var player = new Player(world.generateInstanceId(), user);

            if (!playerData) {
                // First time player entered
            } else {
                // Restore player data
            }

            // Add it to the world
            if (!world.containsPlayer(player)) {
                world.addPlayer(player);
            }

            ackCallback({
                'position' : player.position
            });
        });

        var firstTime = true;

        var player = null;



        // RESPONSE
        // Character position

        return false;
    }

}

export = GameLoadHandler;