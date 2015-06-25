var ParameterCode = require('../../common/ParameterCode');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var ConnectorMessageHandler = (function () {
    function ConnectorMessageHandler(server) {
        this.server = server;
    }
    ConnectorMessageHandler.prototype.getMessageType = function () {
        return 0 /* NoHandler */;
    };
    ConnectorMessageHandler.prototype.handle = function (message, sender) {
        console.log(('Connector: Handle method not overwritten for "' + this.getMessageType() + '"').red);
        return false;
    };
    ConnectorMessageHandler.prototype.handleAck = function (message, sender, ackCallback) {
        console.log(('Connector: Client Handle ACK method not overwritten for "' + this.getMessageType() + '"').red);
        return {};
    };
    ConnectorMessageHandler.prototype.generateErrorResponse = function (message) {
        var response = {};
        response[-1 /* Error */] = message;
        return response;
    };
    return ConnectorMessageHandler;
})();
module.exports = ConnectorMessageHandler;
//# sourceMappingURL=ConnectorMessageHandler.js.map