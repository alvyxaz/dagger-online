/// <reference path='../types' />
import _ = require('lodash');
import fs = require('fs');
import mongoose = require('mongoose');
import Server = require('../core/servers/Server');
import ServerType = require('../core/servers/ServerType');
import GatewayMessageHandler = require('./interfaces/GatewayMessageHandler');
import ClientMessageHandler = require('./interfaces/ClientMessageHandler');
import SubServerMessage = require('../serverCommon/messages/SubServerMessage');
import ClientMessage = require('../common/ClientMessage');
import AvailableConnector = require('./models/AvailableConnector');
import GameServerLink = require('./models/GameServerLink');
import Sockets = require('../core/connections/Sockets');
import SocketsImpl = require('../core/connections/SocketIOSockets');
import DatabaseConnection = require('../database/DatabaseConnection');
import Account = require('./models/Account');

import collections = require('../collections');

/**
 * Server, responsible for authenticating users and giving them a link to
 * connector
 */
class GatewayServer extends Server {
    constructor(name : string, port: number){
        super(ServerType.Gateway, name, port);
    }

    // Handlers
    private handlers : GatewayMessageHandler[] = [];
    private clientHandlers : ClientMessageHandler[] = [];

    // Sockets
    private connectorSocket : Sockets.Server;
    private clientsSocket : Sockets.Server;

    // Connections
    private gameServers = new collections.Dictionary<string, GameServerLink>();
    private connectedAccounts = new collections.Dictionary<string, Account>();

    public db : DatabaseConnection;

    start(config : Object) : void {
        // Opening connector socket
        this.connectorSocket = new SocketsImpl.Server();
        this.connectorSocket.open(config['connectorPort']);

        // Opening clients socket
        this.clientsSocket = new SocketsImpl.Server();
        this.clientsSocket.open(config['port']);

        this.onServerStart();
    }

    public isAccountConnected(username : string) {
        return this.connectedAccounts.containsKey(username);
    }

    public addConnectedAccount(account : Account, accountSocket: Sockets.Socket) {
        this.connectedAccounts.setValue(account.username, account);
        accountSocket.onDisconnect(() => {
            if (!account.isConnectedToGame()) {
                // If user is connected to game, don't remove it from connected accounts.
                // because it will be removed automatically once connector notifies about disconnection
                this.removeConnectedAccount(account);
            }
        });
    }

    private removeConnectedAccount(account: Account) : void {
        this.connectedAccounts.remove(account.username);
    }

    public getConnectedAccount(username : string) : Account {
        if (this.isAccountConnected(username)) {
            var account = this.connectedAccounts.getValue(username);
            return account;
        }
        return null;
    }

    onServerStart() : void {
        console.log('Gateway server'.green + ' started (port: '+this.port+')');

        // Setup handlers and stuff
        this.setup();

        // Clients namespace
        this.clientsSocket.onConnection((socket: Sockets.ServerSocket) => {
            console.log("Client connected to gateway");

            //socket.onMessage((data : JSON) => {
            //    this.handleClientMessage(data, socket);
            //});

            socket.onMessage((data : JSON, callback: (data: any) => void) => {
                this.handleMessage(this.clientHandlers, data, socket, callback);
            });

            socket.onDisconnect(() => {
                console.log("Client disconneceted from gateway");
            });
        });

        // Connector namespace
        this.connectorSocket.onConnection((socket: Sockets.ServerSocket) => {
            socket.onMessage((data : JSON, callback: (data: any) => void) => {
                console.log("Gateway Received sub server message".cyan);
                this.handleMessage(this.handlers, data, socket, callback);
            });
        });
    }

    /**
     * Adds a registered connector
     * Registers a link with game server if one does not exists
     * @param {AvailableConnector} connector - registered connector
     */
    public addConnector(connector : AvailableConnector) : void {
        if (!connector.gameServerName) {
            console.log('Gateway tried to add a connector with undefined game server name'.red);
            return;
        }

        if (!this.gameServers.containsKey(connector.gameServerName)){
            // There's no game server with this name
            var link = new GameServerLink(connector.gameServerName);
            link.addConnector(connector);
            this.gameServers.setValue(link.name, link);
            console.log(( this.name + ': Added game server with name: ' + link.name).cyan);
        } else {
            var link = this.gameServers.getValue(connector.gameServerName);
            link.addConnector(connector);
        }
    }

    /**
     * Removes connector from a list of available
     * @param connector
     */
    public removeConnector(connector: AvailableConnector) : void {
        // Go through all of the game servers to remove this connector,
        // in case it was accidently added to multiple game server links
        console.log("Removing connector, says I don't have a remove");
        _.forEach(this.gameServers, (server: GameServerLink) : void => {
            server.removeConnector(connector);
        })
    }

    public connectToDatabase(dbAddress: string) : void {
        this.db = new DatabaseConnection();
        this.db.connect(dbAddress, () => {
            console.log("Gateway connected to database".green);
        });
    }

    public getGameServers() : GameServerLink[] {
        return this.gameServers.values();
    }

    /**
     * Setting up handlers and stuff
     */
    private setup() : void {
        // Sub server Handlers
        fs.readdirSync(__dirname + '/handlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var HandlerConstructor = require('./handlers/' + fileName);
                var handler : GatewayMessageHandler = new HandlerConstructor(this);
                this.handlers[handler.getMessageType()] = handler;
            }
        });

        // Client handlers
        fs.readdirSync(__dirname + '/clientHandlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var HandlerConstructor = require('./clientHandlers/' + fileName);
                var handler : ClientMessageHandler = new HandlerConstructor(this);
                this.clientHandlers[handler.getMessageType()] = handler;
            }
        });
    }
}

export = GatewayServer;