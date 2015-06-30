/// <reference path='../types' />
import _ = require('lodash');
import fs = require('fs');
import mongoose = require('mongoose');

import Server = require('../core/servers/Server');
import ServerType = require('../core/servers/ServerType');
import SubServerMessage = require('../serverCommon/messages/SubServerMessage');
import Sockets = require('../core/connections/Sockets');
import SocketsImpl = require('../core/connections/SocketIOSockets');
import DatabaseConnection = require('../database/DatabaseConnection');
import GClientMessageHandler = require('./interfaces/GClientMessageHandler');
import ConnectorMessageHandler = require('./interfaces/ConnectorMessageHandler');
import GameServerInfoMessage = require('./messages/GameServerInfoMessage');

import collections = require('../collections');

// Models
import User = require('./models/User');
import World = require('./models/World');

/**
 * Server, responsible for authenticating users and giving them a link to
 * connector
 */
class GameServer extends Server {
    private connectorSocket : Sockets.Server;

    private clientHandlers : Array<GClientMessageHandler> = [];
    private connectorHandlers : Array<ConnectorMessageHandler> = [];

    private lastUserId = 0;
    private usersById = {};
    private usersByUsername = {};

    public db : DatabaseConnection;

    public world: World;

    constructor(name : string, port: number){
        super(ServerType.GameServer, name, port);

        // Setup world
        var world = new World();
        this.world = world
    }

    public connectUser(username: string, connector: Sockets.Socket) : number {
        var newId = ++this.lastUserId;
        var user = new User(newId, username);
        user.setConnector(connector);
        this.usersById[newId] = user;
        this.usersByUsername[username] = user;

        return newId;
    }

    public disconnectUser(id : number) {
        var user : User = this.usersById[id];

        if (user) {
            console.log("GS successfully disconnected a user");
            this.usersById[user.id] = undefined;
            this.usersByUsername[user.username] = undefined;
        } else {
            console.log("Tried to disconnect user, but couldn't find an ID match");
        }
    }

    public getUser(id : number) {
        return this.usersById[id];
    }

    public isUserConnected(username: string) : boolean {
        return this.usersByUsername[username] ? true : false;
    }

    start(config : Object) : void {
        //super.start(config);
        this.connectorSocket = new SocketsImpl.Server();
        this.connectorSocket.open(config['port']);
        this.setup();

        this.onServerStart();
    }

    onServerStart() : void {
        console.log(('Game server '.green +'started (port: '+this.port+')'));

        // Connector namespace
        this.connectorSocket.onConnection((socket: Sockets.ServerSocket) => {
            this.sendMessage(socket, new GameServerInfoMessage(this));
            socket.onMessage((data : Object, callback: (data: Object) => void) => {
                if ('c' in data) {
                    // Client message
                    this.handleMessage(this.clientHandlers, data, socket, callback);
                } else {
                    // Connector message
                    console.log("Tried to handle connector message");
                    this.handleMessage(this.connectorHandlers, data, socket, callback);
                }
            });
        });
    }

    sendMessage(socket: Sockets.Socket, message : SubServerMessage) : void {
        socket.emit('message', message.getData());
    }

    setup() : void {
        // Client handlers
        fs.readdirSync(__dirname + '/clientHandlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var HandlerConstructor = require('./clientHandlers/' + fileName);
                var handler : GClientMessageHandler = new HandlerConstructor(this);
                this.clientHandlers[handler.getMessageType()] = handler;
            }
        });

        // Connector handlers
        fs.readdirSync(__dirname + '/connectorHandlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var ConnectorMessageHandler = require('./connectorHandlers/' + fileName);
                var handler : ConnectorMessageHandler = new ConnectorMessageHandler(this);
                this.connectorHandlers[handler.getMessageType()] = handler;
            }
        });
    }

    public connectToDatabase(dbAddress: string) : void {
        this.db = new DatabaseConnection();
        this.db.connect(dbAddress, () => {
            console.log("Gameserver connected to database".green);
        });
    }
}

export = GameServer;