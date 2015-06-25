var MessageCode = require('../../common/MessageCode');
var ParameterCode = require('../../common/ParameterCode');
var GClientMessageHandler = (function () {
    function GClientMessageHandler(server) {
        this.server = server;
    }
    GClientMessageHandler.prototype.getMessageType = function () {
        return 3 /* Error */;
    };
    GClientMessageHandler.prototype.handleClient = function (message, user) {
    };
    GClientMessageHandler.prototype.handleClientAck = function (message, user, ackCallback) {
        return {};
    };
    GClientMessageHandler.prototype.handle = function (message, sender) {
        var user = this.server.getUser(message['c']);
        if (user && user.isConnected()) {
            this.handleClient(message, user);
            return true;
        }
        console.log(('GS: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    };
    GClientMessageHandler.prototype.handleAck = function (message, sender, ackCallback) {
        var user = this.server.getUser(message['c']);
        if (user && user.isConnected()) {
            return this.handleClientAck(message, user, ackCallback);
        }
        console.log(('GS: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    };
    GClientMessageHandler.prototype.generateErrorResponse = function (message) {
        var response = {};
        response[-1 /* Error */] = message;
        return response;
    };
    return GClientMessageHandler;
})();
module.exports = GClientMessageHandler;
//# sourceMappingURL=GClientMessageHandler.js.map