var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GatewayMessageHandler = require('../interfaces/GatewayMessageHandler');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var SocketData = require('../../serverCommon/SocketData');
var MessageCode = require('../../common/MessageCode');
var AddAccountConfirmHandler = (function (_super) {
    __extends(AddAccountConfirmHandler, _super);
    function AddAccountConfirmHandler() {
        _super.apply(this, arguments);
    }
    AddAccountConfirmHandler.prototype.getMessageType = function () {
        return 3 /* AddAccount */;
    };
    AddAccountConfirmHandler.prototype.handle = function (message, sender) {
        var username = message['username'];
        var key = message['key'];
        var account = this.server.getConnectedAccount(username);
        if (account.socket.isConnected()) {
            var connector = sender.getData(1 /* Connector */);
            if (!connector) {
                console.log("Connector not found while assigning it to user".red);
            }
            account.socket.sendMessage(4 /* AssignConnector */, {
                'address': connector.publicAddress,
                'key': key
            });
        }
        else {
            console.log("Account is no longer connected to assign a connector to it".red);
        }
        return true;
    };
    return AddAccountConfirmHandler;
})(GatewayMessageHandler);
module.exports = AddAccountConfirmHandler;
//# sourceMappingURL=AddAccountConfirmHandler.js.map