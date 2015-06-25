var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
var GameServerInfoHandler = (function (_super) {
    __extends(GameServerInfoHandler, _super);
    function GameServerInfoHandler() {
        _super.apply(this, arguments);
    }
    GameServerInfoHandler.prototype.getMessageType = function () {
        return 2 /* GameServerInfo */;
    };
    GameServerInfoHandler.prototype.handle = function (message, sender) {
        this.server.gameServerInfo = message[2 /* GameServerInfo */];
        this.server.connectToGatewayServer();
        return true;
    };
    GameServerInfoHandler.prototype.handleClient = function (message, sender) {
        return true;
    };
    return GameServerInfoHandler;
})(ConnectorMessageHandler);
module.exports = GameServerInfoHandler;
//# sourceMappingURL=GameServerInfoHandler.js.map