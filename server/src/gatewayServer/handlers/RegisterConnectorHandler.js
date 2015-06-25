var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GatewayMessageHandler = require('../interfaces/GatewayMessageHandler');
var SubServerMessageCode = require('../../serverCommon/messages/SubServerMessageCode');
var AvailableConnector = require('../models/AvailableConnector');
var RegisterConnectorHandler = (function (_super) {
    __extends(RegisterConnectorHandler, _super);
    function RegisterConnectorHandler() {
        _super.apply(this, arguments);
    }
    RegisterConnectorHandler.prototype.getMessageType = function () {
        return 1 /* RegisterConnector */;
    };
    RegisterConnectorHandler.prototype.handle = function (message, sender) {
        this.server.addConnector(new AvailableConnector(this.server, sender, message));
        return true;
    };
    return RegisterConnectorHandler;
})(GatewayMessageHandler);
module.exports = RegisterConnectorHandler;
//# sourceMappingURL=RegisterConnectorHandler.js.map