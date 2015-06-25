var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require('lodash');
var fs = require('fs');
var Server = require('../core/servers/Server');
var ServerType = require('../core/servers/ServerType');
var GameServerLink = require('./models/GameServerLink');
var SocketsImpl = require('../core/connections/SocketIOSockets');
var DatabaseConnection = require('../database/DatabaseConnection');
var collections = require('../collections');
var GatewayServer = (function (_super) {
    __extends(GatewayServer, _super);
    function GatewayServer(name, port) {
        _super.call(this, 0 /* Gateway */, name, port);
        this.handlers = [];
        this.clientHandlers = [];
        this.gameServers = new collections.Dictionary();
        this.connectedAccounts = new collections.Dictionary();
    }
    GatewayServer.prototype.start = function (config) {
        this.connectorSocket = new SocketsImpl.Server();
        this.connectorSocket.open(config['connectorPort']);
        this.clientsSocket = new SocketsImpl.Server();
        this.clientsSocket.open(config['port']);
        this.onServerStart();
    };
    GatewayServer.prototype.isAccountConnected = function (username) {
        return this.connectedAccounts.containsKey(username);
    };
    GatewayServer.prototype.addConnectedAccount = function (account, accountSocket) {
        var _this = this;
        this.connectedAccounts.setValue(account.username, account);
        accountSocket.onDisconnect(function () {
            if (!account.isConnectedToGame()) {
                _this.removeConnectedAccount(account);
            }
        });
    };
    GatewayServer.prototype.removeConnectedAccount = function (account) {
        this.connectedAccounts.remove(account.username);
    };
    GatewayServer.prototype.getConnectedAccount = function (username) {
        if (this.isAccountConnected(username)) {
            var account = this.connectedAccounts.getValue(username);
            return account;
        }
        return null;
    };
    GatewayServer.prototype.onServerStart = function () {
        var _this = this;
        console.log('Gateway server'.green + ' started (port: ' + this.port + ')');
        this.setup();
        this.clientsSocket.onConnection(function (socket) {
            console.log("Client connected to gateway");
            socket.onMessage(function (data, callback) {
                _this.handleMessage(_this.clientHandlers, data, socket, callback);
            });
            socket.onDisconnect(function () {
                console.log("Client disconneceted from gateway");
            });
        });
        this.connectorSocket.onConnection(function (socket) {
            socket.onMessage(function (data, callback) {
                console.log("Gateway Received sub server message".cyan);
                _this.handleMessage(_this.handlers, data, socket, callback);
            });
        });
    };
    GatewayServer.prototype.addConnector = function (connector) {
        if (!connector.gameServerName) {
            console.log('Gateway tried to add a connector with undefined game server name'.red);
            return;
        }
        if (!this.gameServers.containsKey(connector.gameServerName)) {
            var link = new GameServerLink(connector.gameServerName);
            link.addConnector(connector);
            this.gameServers.setValue(link.name, link);
            console.log((this.name + ': Added game server with name: ' + link.name).cyan);
        }
        else {
            var link = this.gameServers.getValue(connector.gameServerName);
            link.addConnector(connector);
        }
    };
    GatewayServer.prototype.removeConnector = function (connector) {
        console.log("Removing connector, says I don't have a remove");
        _.forEach(this.gameServers, function (server) {
            server.removeConnector(connector);
        });
    };
    GatewayServer.prototype.connectToDatabase = function (dbAddress) {
        this.db = new DatabaseConnection();
        this.db.connect(dbAddress, function () {
            console.log("Gateway connected to database".green);
        });
    };
    GatewayServer.prototype.getGameServers = function () {
        return this.gameServers.values();
    };
    GatewayServer.prototype.setup = function () {
        var _this = this;
        fs.readdirSync(__dirname + '/handlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var HandlerConstructor = require('./handlers/' + fileName);
                var handler = new HandlerConstructor(_this);
                _this.handlers[handler.getMessageType()] = handler;
            }
        });
        fs.readdirSync(__dirname + '/clientHandlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var HandlerConstructor = require('./clientHandlers/' + fileName);
                var handler = new HandlerConstructor(_this);
                _this.clientHandlers[handler.getMessageType()] = handler;
            }
        });
    };
    return GatewayServer;
})(Server);
module.exports = GatewayServer;
//# sourceMappingURL=GatewayServer.js.map