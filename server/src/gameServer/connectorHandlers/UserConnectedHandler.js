var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var UserConnectedHandler = (function (_super) {
    __extends(UserConnectedHandler, _super);
    function UserConnectedHandler() {
        _super.apply(this, arguments);
    }
    UserConnectedHandler.prototype.getMessageType = function () {
        return 4 /* UserConnected */;
    };
    UserConnectedHandler.prototype.handleAck = function (message, sender, ackCallback) {
        var username = message['username'];
        if (username) {
            if (this.server.isUserConnected(username)) {
                console.log("User is already connected to game server: ".red + username);
                return this.generateErrorResponse('User is already connected' + this.getMessageType());
                ;
            }
            var id = this.server.connectUser(username, sender);
            ackCallback({
                'id': id
            });
            return;
        }
        return this.generateErrorResponse('Invalid request , msg: ' + this.getMessageType());
    };
    return UserConnectedHandler;
})(ConnectorMessageHandler);
module.exports = UserConnectedHandler;
//# sourceMappingURL=UserConnectedHandler.js.map