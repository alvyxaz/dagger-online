var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Server = require('../core/servers/Server');
var ServerType = require('../core/servers/ServerType');
var SubServerMessageCode = require('../serverCommon/messages/SubServerMessageCode');
var RegisterConnectorMessage = require('../gatewayServer/messages/RegisterConnectorMessage');
var SocketData = require('../serverCommon/SocketData');
var SocketsImpl = require('../core/connections/SocketIOSockets');
var MessageCode = require('../common/MessageCode');
var fs = require('fs');
var io = require('socket.io-client');
var collections = require('../collections');
var ConnectorServer = (function (_super) {
    __extends(ConnectorServer, _super);
    function ConnectorServer(name, port) {
        _super.call(this, 1 /* Connector */, name, port);
        this.handlers = [];
        this.clientHandlers = [];
        this.passes = new collections.Dictionary();
        this.clientConnections = {};
    }
    ConnectorServer.prototype.start = function (config) {
        var _this = this;
        this.configData = config;
        this.maxConnections = config['maxConnections'];
        this.publicAddress = config['publicAddress'];
        this.clientServer = new SocketsImpl.Server();
        this.clientServer.open(config['port']);
        this.clientServer.onConnection(function (client) {
            console.log("Connector sent a message");
            client.sendMessage(5 /* CredentialsRequest */, {});
            client.onMessage(function (data, callback) {
                if (client.getData(3 /* IsInGameServer */)) {
                    var clientId = client.getData(4 /* UserId */);
                    _this.passMessageToGameserver(data, clientId, callback);
                }
                else {
                    _this.handleMessage(_this.clientHandlers, data, client, callback);
                }
            });
            client.onDisconnect(function () {
                console.log("Client disconnected");
                if (client.getData(3 /* IsInGameServer */)) {
                    var id = client.getData(4 /* UserId */);
                    _this.sendGameserverMessage(5 /* UserDisconnected */, {
                        'id': client.getData(4 /* UserId */)
                    });
                }
            });
        });
        this.onServerStart();
        this.connectToGameServer(config['gameServerAddress']);
    };
    ConnectorServer.prototype.onServerStart = function () {
        this.setup();
    };
    ConnectorServer.prototype.initializeFromConfig = function (data) {
        this.configData = data;
        this.maxConnections = data['maxConnections'];
        this.publicAddress = data['publicAddress'];
        this.start({});
        this.connectToGameServer(data['gameServerAddress']);
    };
    ConnectorServer.prototype.addClientConnectionLink = function (id, socket) {
        if (this.clientConnections[id]) {
            console.log("Connector already made link between client and GS :".red + id);
            return;
        }
        this.clientConnections[id] = socket;
    };
    ConnectorServer.prototype.connectToGameServer = function (address) {
        var _this = this;
        var gameServerClient = new SocketsImpl.Client();
        this.gameSocket = gameServerClient.connect(address, { 'multiplex': false });
        var socket = this.gameSocket;
        socket.onConnect(function () {
            console.log('Connector "' + _this.name + '" connected to ' + ('GameServer(' + address + ')').yellow);
        });
        socket.onDisconnect(function () {
            console.log('Connector "' + _this.name + '" disconnected from ' + 'GameServer'.red);
        });
        socket.onConnectError(function (error) {
            console.log('Got Error:'.red);
            console.log(error.stack);
        });
        socket.onMessage(function (data, callback) {
            _this.handleMessage(_this.handlers, data, socket, callback);
        });
    };
    ConnectorServer.prototype.connectToGatewayServer = function () {
        var _this = this;
        var gatewayClient = new SocketsImpl.Client();
        this.gatewaySocket = gatewayClient.connect(this.configData['gatewayAddress'], { 'multiplex': false });
        var socket = this.gatewaySocket;
        socket.onConnect(function () {
            console.log('Connector "' + _this.name + '" connected to ' + ('GatewayServer(' + _this.configData['gatewayAddress'] + ')').yellow);
            _this.sendGatewayMessage(new RegisterConnectorMessage(_this));
        });
        socket.onDisconnect(function () {
            console.log('Connector "' + _this.name + '" disconnected from ' + 'GatewayServer'.red);
        });
        socket.onConnectError(function (error) {
            console.log('Got Error:'.red);
            console.log(error.stack);
        });
        socket.onMessage(function (data, callback) {
            if (data['p'] && data['o']) {
                try {
                    if (callback) {
                        console.log("GS should never wait for ack in case of multiple peers".red);
                        callback({});
                        return;
                    }
                    var peers = data['p'];
                    peers.forEach(function (clientId) {
                        var socket = _this.clientConnections[clientId];
                        socket.sendMessage(data['o'], data);
                    });
                }
                catch (e) {
                    console.log("Crashed while trying to pass message: ".red + data['o'] + " to peers: " + data['p']);
                    console.log(e);
                    console.trace();
                }
            }
            else {
                _this.handleMessage(_this.handlers, data, socket, callback);
            }
        });
    };
    ConnectorServer.prototype.sendGatewayMessage = function (message) {
        this.gatewaySocket.sendMessage(message.getOpCode(), message.getData());
    };
    ConnectorServer.prototype.passMessageToGameserver = function (data, clientId, callback) {
        var code = data['o'];
        if (code && !data['c']) {
            data['c'] = clientId;
            this.gameSocket.sendMessage(code, data, callback);
        }
        else {
            console.log("Connector tried to pass a message without opcode or with fake parameter 'c'".red);
        }
    };
    ConnectorServer.prototype.sendGameserverMessage = function (code, data, callback) {
        this.gameSocket.sendMessage(code, data, callback);
    };
    ConnectorServer.prototype.addPass = function (key, username) {
        if (!this.passes.containsKey(key)) {
            this.passes.setValue(key, username);
            return true;
        }
        return false;
    };
    ConnectorServer.prototype.getPassUsername = function (key) {
        return this.passes.getValue(key);
    };
    ConnectorServer.prototype.setup = function () {
        var _this = this;
        fs.readdirSync(__dirname + '/handlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var ConnectorMessageHandler = require('./handlers/' + fileName);
                var handler = new ConnectorMessageHandler(_this);
                _this.handlers[handler.getMessageType()] = handler;
            }
        });
        fs.readdirSync(__dirname + '/clientHandlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var CClientMessageHandler = require('./clientHandlers/' + fileName);
                var handler = new CClientMessageHandler(_this);
                _this.clientHandlers[handler.getMessageType()] = handler;
            }
        });
    };
    return ConnectorServer;
})(Server);
module.exports = ConnectorServer;
//# sourceMappingURL=ConnectorServer.js.map