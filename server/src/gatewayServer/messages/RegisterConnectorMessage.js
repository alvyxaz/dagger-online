var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SubServerMessage = require('../../serverCommon/messages/subServerMessage');
var SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');
var SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
var RegisterConnectorMessage = (function (_super) {
    __extends(RegisterConnectorMessage, _super);
    function RegisterConnectorMessage(connectorServer) {
        _super.call(this, 1 /* RegisterConnector */);
        var data = {};
        data[0 /* MaxConnections */] = connectorServer.maxConnections;
        data[2 /* GameServerInfo */] = connectorServer.gameServerInfo;
        data[3 /* PublicAddress */] = connectorServer.publicAddress;
        _super.prototype.setData.call(this, data);
    }
    return RegisterConnectorMessage;
})(SubServerMessage);
module.exports = RegisterConnectorMessage;
//# sourceMappingURL=RegisterConnectorMessage.js.map