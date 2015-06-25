/**
 * Created by Alvys on 2015-05-26.
 */
/// <reference path='../../types.ts' />
var SocketIO = require('socket.io');

import ServerType = require('./ServerType');
import Sockets = require('../connections/Sockets');
import MessageHandler = require('../messages/MessageHandler');
import ParameterCode = require('../../common/ParameterCode');

/**
 * Base class for servers
 */
class Server <> {
    public name: string;
    public type : ServerType;
    private io : SocketIO.Server;
    public port : number;

    //public handlers : Array<MessageHandler<number, Object>> = [];
    //public clientHandlers : Array<MessageHandler<number, Object>> = [];

    constructor(type : ServerType, name : string, port: number){
        this.type = type;
        this.port = port;
        this.name = name;
    }

    start (config : Object) :void {
        console.warn("Not implemented server 'start' method")
        //this.io = new SocketIO(this.port);
        //this.onServerStart(this.io);
    }

    protected onServerStart(server: SocketIO.Server) : void {
        console.log("Not overloaded");
    }

    public handleMessage(handlers: Array<MessageHandler<number, Object>>, message : Object, sender: Sockets.Socket, ackCallback? : (data: any) => void) {
        try {
            if (ackCallback) {
                // Client's waiting for ackowledgement
                var response = handlers[message['o']].handleAck(message, sender, ackCallback);
                if (response) {
                    // Send back a response if one exists (response is false if handler manually handles acknowledgment)
                    ackCallback(response);
                }
            } else if (!handlers[message['o']].handle(message, sender)) {
                console.log((this.name + ': Failed to handle a message "'  + message['o'] + '". Content').red);
                console.log(message);
            }
        } catch (exception) {
            console.log("AND HERE");
            if (ackCallback) {
                var res = {};
                res[ParameterCode.Error] = 'Internal server error';
                ackCallback(res);
            }
            console.log((this.name + ': Failed to handle a message "'  + message['o'] + '". Content').red);
            console.log(message);
            console.log(exception);
        }
    }
}

export = Server;