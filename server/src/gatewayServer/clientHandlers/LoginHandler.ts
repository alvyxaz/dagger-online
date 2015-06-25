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

import _ = require('lodash');

class LoginHandler extends ClientMessageHandler{
    getMessageType() : MessageCode {
        return MessageCode.Login;
    }

    handleAck(message: Object, sender: Sockets.Socket, callback? : (data: Object) => {}) : Object {
        if (this.isDataValid(message)) {
            /*--------------------
             * Logging in as guest
             */
            if (message['guest']) {
                var connectedAccount = new Account('Guest-' + this.getRandomInt(0, 10000000), sender);
                connectedAccount.markAsGuest();
                this.server.addConnectedAccount(connectedAccount, sender);
                console.log(("Guest logged in successfully " + connectedAccount.username).green);
                sender.setData(SocketData.Account, connectedAccount);

                // TODO implement it
                console.log("Guest login functionality is not finished (selects first GS)");
                return this.getWorldsSelection();
            }

            /*--------------------
             * Logging in with credentials
             */
            var username = message['username'];

            // All the data is valid, we can now save the account to database
            Models.Account.findOne( {'username' : username}, (err : any, account: any) => {
                if (err) {
                    callback(this.generateErrorResponse("Couldn't find a user"));
                    return console.log("Couldn't find a user");
                }

                if (!account) {
                    callback(this.generateErrorResponse("Bad login credentials"));
                    return console.log("User not found".red);
                }

                // TODO: Check password hash (first implement it)
                if (account.password === message['password']) {
                    // Password is good
                    if (!this.server.isAccountConnected(username)) {
                        var connectedAccount = new Account(username, sender);
                        this.server.addConnectedAccount(connectedAccount, sender);
                        console.log(("User logged in successfully " + account.password + " = " + message['password']).green);
                        sender.setData(SocketData.Account, connectedAccount);
                        callback(this.getWorldsSelection());
                    } else {
                        // User is already connected
                        callback(this.generateErrorResponse("User is allready connected"));
                        console.log("Account is allready connected".red);
                        return true;
                    }
                } else {
                    // Wrong password
                    callback(this.generateErrorResponse("Bad login credentials"));
                    console.log("User credentials are wrong".red);
                }
            })
        }
        return false;
    }

    getRandomInt(min, max) : number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getWorldsSelection() : Object {
        return _.map(this.server.getGameServers(), (serverLink: GameServerLink) => {
            return {
                'name' : serverLink.name
            }
        });
    }

    isDataValid(message : Object): boolean {
        return true;
    }
}

export = LoginHandler;