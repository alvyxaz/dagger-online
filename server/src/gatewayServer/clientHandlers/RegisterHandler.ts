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

import mongoose = require('mongoose');
import Models = require('../../database/Models');

import CryptoJS = require('crypto-js');

class RegisterHandler extends ClientMessageHandler{
    getMessageType() : MessageCode {
        return MessageCode.Register;
    }

    handle(message: Object, sender : Sockets.Socket) : boolean {
        if (this.isDataValid(message)) {
            // All the data is valid, we can now save the account to database

            var account = new Models.Account({
                'username' : message['username'],
                'password' : message['password'],
                'salt' : 'Druskike',
                'email' : message['email']
            });

            account.save((err : any, accout: any) => {
                if (err) {
                    // TODO: Find out which one
                    return console.log("Username or email already exists");
                }
                console.log("User created successfully");
            });
        }
        return true;
    }

    isDataValid(message : Object): boolean {
        return true;
    }
}

export = RegisterHandler;