var ParameterCode = require('../../common/ParameterCode');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var GatewayMessageHandler = (function () {
    function GatewayMessageHandler(server) {
        this.server = server;
    }
    GatewayMessageHandler.prototype.getMessageType = function () {
        return 0 /* NoHandler */;
    };
    GatewayMessageHandler.prototype.handle = function (message, sender) {
        console.log(('Gateway: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    };
    GatewayMessageHandler.prototype.handleAck = function (message, sender, ackCallback) {
        console.log(('Gateway: Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    };
    GatewayMessageHandler.prototype.generateErrorResponse = function (message) {
        var response = {};
        response[-1 /* Error */] = message;
        return response;
    };
    return GatewayMessageHandler;
})();
module.exports = GatewayMessageHandler;
//# sourceMappingURL=GatewayMessageHandler.js.map