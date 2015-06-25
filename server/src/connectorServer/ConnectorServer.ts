/// <reference path='../types' />
import Server = require('../core/servers/Server');
import ServerType = require('../core/servers/ServerType');
import SubServerMessage = require('../serverCommon/messages/SubServerMessage');
import SubServerMessageCode = require('../serverCommon/messages/SubServerMessageCode');
import RegisterConnectorMessage = require('../gatewayServer/messages/RegisterConnectorMessage');
import ConnectorMessageHandler = require('./interfaces/ConnectorMessageHandler');
import CClientMessageHandler = require('./interfaces/CClientMessageHandler');
import Sockets = require('../core/connections/Sockets');
import SocketData = require('../serverCommon/SocketData');
import SocketsImpl = require('../core/connections/SocketIOSockets');

import MessageCode = require('../common/MessageCode');

import fs = require('fs');

var io = require('socket.io-client');

import collections = require('../collections');

/**
 * Server, responsible for authenticating users and giving them a link to
 * connector
 */
class ConnectorServer extends Server {
    private configData : Object;
    private clientServer: Sockets.Server;
    private gameSocket : Sockets.ClientSocket;
    private gatewaySocket : Sockets.ClientSocket;

    private handlers : ConnectorMessageHandler[] = [];
    private clientHandlers : CClientMessageHandler[] = [];

    public maxConnections : number;
    public gameServerInfo: Object;
    public publicAddress: string;

    // Gateway confirmations
    private passes = new collections.Dictionary<string, string>(); // Connection Key, Username
    private clientConnections : Object = {};

    constructor(name : string, port: number){ super(ServerType.Connector, name, port);}

    start(config : Object) : void {
        this.configData = config;
        this.maxConnections = config['maxConnections'];
        this.publicAddress = config['publicAddress'];

        // Opening socket for clients
        this.clientServer = new SocketsImpl.Server();
        this.clientServer.open(config['port']);
        this.clientServer.onConnection((client: Sockets.Socket) => {
            console.log("Connector sent a message");
            client.sendMessage(MessageCode.CredentialsRequest, {})

            client.onMessage((data: any, callback: (data: any) => void) => {
                if (client.getData(SocketData.IsInGameServer)) {
                    var clientId = client.getData(SocketData.UserId);
                    // Client is connected to game server, pass the message to it
                    this.passMessageToGameserver(data, clientId, callback);
                } else {
                    // Connector can handle the message
                    this.handleMessage(this.clientHandlers, data, client, callback);
                }
            });

            client.onDisconnect(() => {
                console.log("Client disconnected");
                if (client.getData(SocketData.IsInGameServer)) {
                    var id : number = client.getData(SocketData.UserId);
                    this.sendGameserverMessage(SubServerMessageCode.UserDisconnected, {
                        'id' : client.getData(SocketData.UserId)
                    });
                }
            });
        });

        this.onServerStart();
        this.connectToGameServer(config['gameServerAddress']);
    }

    onServerStart() : void {
        this.setup();
    }

    initializeFromConfig(data: Object) {
        this.configData = data;
        this.maxConnections = data['maxConnections'];
        this.publicAddress = data['publicAddress'];
        this.start({});
        this.connectToGameServer(data['gameServerAddress']);
    }

    public addClientConnectionLink(id: number, socket: Sockets.Socket) : void {
        if (this.clientConnections[id]) {
            console.log("Connector already made link between client and GS :".red + id);
            return;
        }
        this.clientConnections[id] = socket;
    }

    /**
     * Connects to a Game Server
     * @param address
     */
    private connectToGameServer(address: string) : void {
        var gameServerClient = new SocketsImpl.Client();
        this.gameSocket = gameServerClient.connect(address, {'multiplex': false});
        var socket = this.gameSocket;

        socket.onConnect(() => {
            console.log('Connector "'+ this.name + '" connected to ' + ('GameServer('+address+')').yellow);
        });

        socket.onDisconnect(() => {
            console.log('Connector "'+ this.name + '" disconnected from ' + 'GameServer'.red);
        });

        socket.onConnectError((error) => {
            console.log('Got Error:'.red);
            console.log(error.stack);
        });

        socket.onMessage((data: any, callback: (data: any) => void) => {
            this.handleMessage(this.handlers, data, socket, callback);
        });
    }

    /**
     * Connects to a gateway server
     * @param address
     */
    public connectToGatewayServer() : void {
        var gatewayClient = new SocketsImpl.Client();
        this.gatewaySocket = gatewayClient.connect(this.configData['gatewayAddress'], {'multiplex': false});
        var socket = this.gatewaySocket;

        socket.onConnect(() => {
            console.log('Connector "'+ this.name + '" connected to ' + ('GatewayServer('+this.configData['gatewayAddress']+')').yellow);
            this.sendGatewayMessage(new RegisterConnectorMessage(this));
        });

        socket.onDisconnect(() => {
            console.log('Connector "'+ this.name + '" disconnected from ' + 'GatewayServer'.red);
        });

        socket.onConnectError((error) => {
            console.log('Got Error:'.red);
            console.log(error.stack);
        });

        socket.onMessage((data: any, callback: (data: any) => void) => {
            if(data['p'] && data['o']) {
                try {
                    if (callback) {
                        console.log("GS should never wait for ack in case of multiple peers".red);
                        callback({}); // Allow GC to clean it
                        return;
                    }

                    var peers : Array<number> = data['p'];
                    peers.forEach((clientId) => {
                        var socket : Sockets.Socket= this.clientConnections[clientId];
                        socket.sendMessage(data['o'], data);
                    })
                } catch (e) {
                    console.log("Crashed while trying to pass message: ".red +data['o']+ " to peers: " + data['p']);
                    console.log(e);
                    console.trace();
                }
                // GS passed a message with a list of peers
            } else {
                this.handleMessage(this.handlers, data, socket, callback);
            }
        });
    }

    public sendGatewayMessage( message: SubServerMessage) {
        this.gatewaySocket.sendMessage(message.getOpCode(), message.getData());
        //this.gatewaySocket.emit('message', message.getData());
    }

    public passMessageToGameserver(data: Object, clientId: number, callback?) {
        var code : number = data['o'];
        if (code && !data['c']) {
            data['c'] = clientId; // Mark that this message was passed from client
            this.gameSocket.sendMessage(code, data, callback);
        } else {
            console.log("Connector tried to pass a message without opcode or with fake parameter 'c'".red)
        }
    }

    public sendGameserverMessage( code : number, data: Object, callback? : (data: Object) => any) {
        this.gameSocket.sendMessage(code, data, callback);
    }

    public addPass(key: string, username : string) : boolean {
        if (!this.passes.containsKey(key)) {
            this.passes.setValue(key, username);
            return true;
        }
        return false;
    }

    public getPassUsername(key: string) : string {
        return this.passes.getValue(key);
    }

    /**
     * Setting up handlers and stuff
     */
    private setup() : void {
        // Sub server handlers
        fs.readdirSync(__dirname + '/handlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var ConnectorMessageHandler = require('./handlers/' + fileName);
                var handler : ConnectorMessageHandler = new ConnectorMessageHandler(this);
                this.handlers[handler.getMessageType()] = handler;
            }
        });

        // Client handlers
        fs.readdirSync(__dirname + '/clientHandlers').forEach((fileName : string) => {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                // It's a correct, generated js file (not .map or .ts)
                // TODO find a typesafe way to initialize dynamically
                var CClientMessageHandler = require('./clientHandlers/' + fileName);
                var handler : CClientMessageHandler = new CClientMessageHandler(this);
                this.clientHandlers[handler.getMessageType()] = handler;
            }
        });
    }
}

export = ConnectorServer;