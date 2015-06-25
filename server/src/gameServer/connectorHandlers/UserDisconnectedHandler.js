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
        return 5 /* UserDisconnected */;
    };
    UserConnectedHandler.prototype.handle = function (message, sender, ackCallback) {
        if (message['id']) {
            this.server.disconnectUser(message['id']);
        }
        else {
            console.log("Tried to disconenct a user without id");
        }
        return true;
    };
    return UserConnectedHandler;
})(ConnectorMessageHandler);
module.exports = UserConnectedHandler;
//# sourceMappingURL=UserDisconnectedHandler.js.map