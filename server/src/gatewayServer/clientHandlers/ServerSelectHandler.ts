/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import ClientMessageHandler = require('../interfaces/ClientMessageHandler');
import ClientMessage = require('../../common/ClientMessage');
import MessageCode = require('../../common/MessageCode');
import ParameterCode = require('../../common/ParameterCode');
import AvailableConnector = require('../models/AvailableConnector');
import Sockets = require('../../core/connections/Sockets');
import SocketData = require('../../serverCommon/SocketData');
import mongoose = require('mongoose');
import Models = require('../../database/Models');
import Account = require('../models/Account');
import GameServerLink = require('../models/GameServerLink');
import SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');

import _ = require('lodash');
import crypto = require('crypto');

class ServerSelectHandler extends ClientMessageHandler{
    getMessageType() : MessageCode {
        return MessageCode.ServerSelect;
    }

    handleAck(message: Object, sender : Sockets.Socket, ackCallback : (data: Object) => void) : Object {
        var gameServerName = message['server'];

        if (!gameServerName) {
            console.log("Tried to select server without providing server name".red);
            return this.generateErrorResponse("Invalid server request");
        }

        var account : Account = sender.getData(SocketData.Account);
        if(this.server.isAccountConnected(account.username)) {
            // Account is connected
            var gameServer = _.find(this.server.getGameServers(), (iGameServer : GameServerLink) => {
               return iGameServer.name === gameServerName
            });

            if (!gameServer) {
                console.log("Game server not found".red);
                return this.generateErrorResponse("Game server not found");
            }

            var connector = gameServer.getAvailableConnector();
            var key = crypto.randomBytes(20);

            connector.sendMessage(SubServerMessageCode.AddAccount, {
                'key' : key.toString(),
                'username' : account.username,
                'isGuest' : account.isGuest
            }, ackCallback);

        } else {
            // TODO send an error
            console.log("Gateway: Session has expired?".red);
            return this.generateErrorResponse("Your session has expired. Please login again");
        }

        return false;
    }

    sendWorldsSelection(clientSocket : Sockets.Socket) : void {
        clientSocket.sendMessage(MessageCode.Login, {
            'servers' : _.map(this.server.getGameServers(), (serverLink: GameServerLink) => {
                return {
                    'name' : serverLink.name
                }
            })
         });
    }

    isDataValid(message : Object): boolean {
        return true;
    }
}

export = ServerSelectHandler;