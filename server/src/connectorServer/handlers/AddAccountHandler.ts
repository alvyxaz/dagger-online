/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />

import ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
import SubServerMessage = require('../../serverCommon/messages/SubServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
import Sockets = require('../../core/connections/Sockets');

class AddAccountHandler extends ConnectorMessageHandler{

    getMessageType() : SubServerMessageCode {
        return SubServerMessageCode.AddAccount;
    }

    handleAck(message: Object, sender : Sockets.Socket) : Object {
        var key = message['key'];
        var username = message['username'];
        var isGuest = message['isGuest']; // TODO do something with guest

        if (this.server.addPass(key, username)) {
            console.log("Connector added pass for user: " + username + " pass: " + key);
            return {
                'success' : true,
                'username' : username,
                'key' : key,
                'address' : this.server.publicAddress
            }
        } else {
            console.log(("Failed to add a pass for user: " + username).red);
            return this.generateErrorResponse('Access denied 1');
        }
        return this.generateErrorResponse('Access denied 2');
    }
}

export = AddAccountHandler;