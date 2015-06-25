var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CClientMessageHandler = require('../interfaces/CClientMessageHandler');
var MessageCode = require('../../common/MessageCode');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var SocketData = require('../../serverCommon/SocketData');
var CredentialsRequestHandler = (function (_super) {
    __extends(CredentialsRequestHandler, _super);
    function CredentialsRequestHandler() {
        _super.apply(this, arguments);
    }
    CredentialsRequestHandler.prototype.getMessageType = function () {
        return 5 /* CredentialsRequest */;
    };
    CredentialsRequestHandler.prototype.handleAck = function (message, sender, ackCallback) {
        var _this = this;
        var key = message['key'];
        var username = this.server.getPassUsername(key);
        if (username) {
            this.server.sendGameserverMessage(4 /* UserConnected */, {
                'username': username
            }, function (data) {
                if (data['id']) {
                    sender.setData(4 /* UserId */, data['id']);
                    sender.setData(2 /* Username */, username);
                    sender.setData(3 /* IsInGameServer */, true);
                    ackCallback({});
                    console.log("Connector linked game server to player: ".yellow + username.cyan);
                    return false;
                }
                else {
                    ackCallback(_this.generateErrorResponse('Invalid request'));
                }
            });
            return false;
        }
        return this.generateErrorResponse('Access denied');
    };
    return CredentialsRequestHandler;
})(CClientMessageHandler);
module.exports = CredentialsRequestHandler;
//# sourceMappingURL=CredentialsRequestHandler.js.map