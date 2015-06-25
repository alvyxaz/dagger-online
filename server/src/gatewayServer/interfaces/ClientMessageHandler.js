var ParameterCode = require('../../common/ParameterCode');
var ClientMessageHandler = (function () {
    function ClientMessageHandler(server) {
        this.server = server;
    }
    ClientMessageHandler.prototype.getMessageType = function () {
        throw Error("getMessageType() not implemented");
    };
    ClientMessageHandler.prototype.handle = function (message, sender) {
        console.log(('Gateway: Client Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    };
    ClientMessageHandler.prototype.handleAck = function (message, sender, callback) {
        console.log(('Gateway: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    };
    ClientMessageHandler.prototype.generateErrorResponse = function (message) {
        var response = {};
        response[-1 /* Error */] = message;
        return response;
    };
    return ClientMessageHandler;
})();
module.exports = ClientMessageHandler;
//# sourceMappingURL=ClientMessageHandler.js.map