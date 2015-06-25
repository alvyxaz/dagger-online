var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConnectorMessageHandler = require('../interfaces/ConnectorMessageHandler');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var AddAccountHandler = (function (_super) {
    __extends(AddAccountHandler, _super);
    function AddAccountHandler() {
        _super.apply(this, arguments);
    }
    AddAccountHandler.prototype.getMessageType = function () {
        return 3 /* AddAccount */;
    };
    AddAccountHandler.prototype.handleAck = function (message, sender) {
        var key = message['key'];
        var username = message['username'];
        var isGuest = message['isGuest'];
        if (this.server.addPass(key, username)) {
            console.log("Connector added pass for user: " + username + " pass: " + key);
            return {
                'success': true,
                'username': username,
                'key': key,
                'address': this.server.publicAddress
            };
        }
        else {
            console.log(("Failed to add a pass for user: " + username).red);
            return this.generateErrorResponse('Access denied 1');
        }
        return this.generateErrorResponse('Access denied 2');
    };
    return AddAccountHandler;
})(ConnectorMessageHandler);
module.exports = AddAccountHandler;
//# sourceMappingURL=AddAccountHandler.js.map