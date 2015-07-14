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
            var pos = null;
            var zone: Zone = null;

            var isPlayerCreated = false;

            if (!playerData) {
                // First time player entered
                zone = world.getStarterZone();
                pos = zone.getPosition("start");
                isPlayerCreated = true;
            } else {
                // Restore player data
                zone = world.getZoneByName(playerData['zone']);
                pos = playerData['position'];
            }

            if (!pos || !zone) {
                console.log("Starter zone not found".red);
                ackCallback(this.generateErrorResponse("Couldn't find a zone"));
                return;
            }

            // Add it to the world
            if (world.containsPlayer(player)) {
                console.log("Player is already playing".red);
                ackCallback(this.generateErrorResponse("Player is already playing"));
                return;
            }

            world.addPlayer(player);
            zone.addPlayer(player, new Position(pos[0], pos[1]));

            if (isPlayerCreated) {
                // Save newly created player
                this.server.persistence.savePlayer(player, true);
            }

            ackCallback({
                'position' : player.position.toArray(),
                'zone' : zone.name,
                'scene' : zone.template.scene
            });
        });

        // RESPONSE
        // Character position

        return false;
    }

}

export = GameLoadHandler;