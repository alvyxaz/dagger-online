var MessageCode = require('../../common/MessageCode');
var ParameterCode = require('../../common/ParameterCode');
var CClientMessageHandler = (function () {
    function CClientMessageHandler(server) {
        this.server = server;
    }
    CClientMessageHandler.prototype.getMessageType = function () {
        return 3 /* Error */;
    };
    CClientMessageHandler.prototype.handle = function (message, sender) {
        console.log(('Connector: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    };
    CClientMessageHandler.prototype.handleAck = function (message, sender, ackCallback) {
        console.log(('Connector: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    };
    CClientMessageHandler.prototype.generateErrorResponse = function (message) {
        var response = {};
        response[-1 /* Error */] = message;
        return response;
    };
    return CClientMessageHandler;
})();
module.exports = CClientMessageHandler;
//# sourceMappingURL=CClientMessageHandler.js.map