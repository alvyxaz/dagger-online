var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ClientMessageHandler = require('../interfaces/ClientMessageHandler');
var MessageCode = require('../../common/MessageCode');
var SocketData = require('../../serverCommon/SocketData');
var SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');
var _ = require('lodash');
var crypto = require('crypto');
var ServerSelectHandler = (function (_super) {
    __extends(ServerSelectHandler, _super);
    function ServerSelectHandler() {
        _super.apply(this, arguments);
    }
    ServerSelectHandler.prototype.getMessageType = function () {
        return 2 /* ServerSelect */;
    };
    ServerSelectHandler.prototype.handleAck = function (message, sender, ackCallback) {
        var gameServerName = message['server'];
        if (!gameServerName) {
            console.log("Tried to select server without providing server name".red);
            return this.generateErrorResponse("Invalid server request");
        }
        var account = sender.getData(0 /* Account */);
        if (this.server.isAccountConnected(account.username)) {
            var gameServer = _.find(this.server.getGameServers(), function (iGameServer) {
                return iGameServer.name === gameServerName;
            });
            if (!gameServer) {
                console.log("Game server not found".red);
                return this.generateErrorResponse("Game server not found");
            }
            var connector = gameServer.getAvailableConnector();
            var key = crypto.randomBytes(20);
            connector.sendMessage(3 /* AddAccount */, {
                'key': key.toString(),
                'username': account.username,
                'isGuest': account.isGuest
            }, ackCallback);
        }
        else {
            console.log("Gateway: Session has expired?".red);
            return this.generateErrorResponse("Your session has expired. Please login again");
        }
        return false;
    };
    ServerSelectHandler.prototype.sendWorldsSelection = function (clientSocket) {
        clientSocket.sendMessage(0 /* Login */, {
            'servers': _.map(this.server.getGameServers(), function (serverLink) {
                return {
                    'name': serverLink.name
                };
            })
        });
    };
    ServerSelectHandler.prototype.isDataValid = function (message) {
        return true;
    };
    return ServerSelectHandler;
})(ClientMessageHandler);
module.exports = ServerSelectHandler;
//# sourceMappingURL=ServerSelectHandler.js.map