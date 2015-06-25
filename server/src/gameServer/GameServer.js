var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');
var Server = require('../core/servers/Server');
var ServerType = require('../core/servers/ServerType');
var SocketsImpl = require('../core/connections/SocketIOSockets');
var GameServerInfoMessage = require('./messages/GameServerInfoMessage');
var User = require('./models/User');
var GameServer = (function (_super) {
    __extends(GameServer, _super);
    function GameServer(name, port) {
        _super.call(this, 2 /* GameServer */, name, port);
        this.clientHandlers = [];
        this.connectorHandlers = [];
        this.lastUserId = 0;
        this.usersById = {};
        this.usersByUsername = {};
    }
    GameServer.prototype.connectUser = function (username, connector) {
        var newId = ++this.lastUserId;
        var user = new User(newId, username);
        user.setConnector(connector);
        this.usersById[newId] = user;
        this.usersByUsername[username] = user;
        return newId;
    };
    GameServer.prototype.disconnectUser = function (id) {
        var user = this.usersById[id];
        if (user) {
            console.log("GS successfully disconnected a user");
            this.usersById[user.id] = undefined;
            this.usersByUsername[user.username] = undefined;
        }
        else {
            console.log("Tried to disconnect user, but couldn't find an ID match");
        }
    };
    GameServer.prototype.getUser = function (id) {
        return this.usersById[id];
    };
    GameServer.prototype.isUserConnected = function (username) {
        return this.usersByUsername[username] ? true : false;
    };
    GameServer.prototype.start = function (config) {
        this.connectorSocket = new SocketsImpl.Server();
        this.connectorSocket.open(config['port']);
        this.setup();
        this.onServerStart();
    };
    GameServer.prototype.onServerStart = function () {
        var _this = this;
        console.log(('Game server '.green + 'started (port: ' + this.port + ')'));
        this.connectorSocket.onConnection(function (socket) {
            _this.sendMessage(socket, new GameServerInfoMessage(_this));
            socket.onMessage(function (data, callback) {
                if ('c' in data) {
                    _this.handleMessage(_this.clientHandlers, data, socket, callback);
                }
                else {
                    console.log("Tried to handle connector message");
                    _this.handleMessage(_this.connectorHandlers, data, socket, callback);
                }
            });
        });
    };
    GameServer.prototype.sendMessage = function (socket, message) {
        socket.emit('message', message.getData());
    };
    GameServer.prototype.setup = function () {
        var _this = this;
        fs.readdirSync(__dirname + '/clientHandlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var HandlerConstructor = require('./clientHandlers/' + fileName);
                var handler = new HandlerConstructor(_this);
                _this.clientHandlers[handler.getMessageType()] = handler;
            }
        });
        fs.readdirSync(__dirname + '/connectorHandlers').forEach(function (fileName) {
            if (fileName.indexOf('.js') > 0 && fileName.indexOf('.map') === -1) {
                var ConnectorMessageHandler = require('./connectorHandlers/' + fileName);
                var handler = new ConnectorMessageHandler(_this);
                _this.connectorHandlers[handler.getMessageType()] = handler;
            }
        });
    };
    return GameServer;
})(Server);
module.exports = GameServer;
//# sourceMappingURL=GameServer.js.map