var SocketData = require('../../serverCommon/SocketData');
var SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
var AvailableConnector = (function () {
    function AvailableConnector(server, socket, message) {
        var _this = this;
        this.connectedCount = 0;
        this.socket = socket;
        this.server = server;
        this.maxConnections = message[0 /* MaxConnections */];
        this.publicAddress = message[3 /* PublicAddress */];
        var gameServerInfo = message[2 /* GameServerInfo */];
        this.gameServerName = gameServerInfo['name'];
        socket.setData(1 /* Connector */, this);
        socket.onDisconnect(function () {
            server.removeConnector(_this);
            if (_this.gameServerLink) {
                _this.gameServerLink.removeConnector(_this);
            }
        });
    }
    AvailableConnector.prototype.sendMessage = function (code, data, callback) {
        this.socket.sendMessage(code, data, callback);
    };
    AvailableConnector.prototype.setGameServerLink = function (gameServer) {
        this.gameServerLink = gameServer;
    };
    AvailableConnector.prototype.removeGameServerLink = function (gameServer) {
        if (this.gameServerLink === gameServer) {
            this.gameServerLink = undefined;
        }
    };
    AvailableConnector.prototype.isFull = function () {
        return (this.maxConnections < this.connectedCount);
    };
    AvailableConnector.prototype.getId = function () {
        return this.socket.getSid();
    };
    return AvailableConnector;
})();
module.exports = AvailableConnector;
//# sourceMappingURL=AvailableConnector.js.map