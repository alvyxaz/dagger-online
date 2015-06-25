var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SubServerMessage = require('../../serverCommon/messages/subServerMessage');
var SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');
var SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
var GameServerInfoMessage = (function (_super) {
    __extends(GameServerInfoMessage, _super);
    function GameServerInfoMessage(gameServer) {
        _super.call(this, 2 /* GameServerInfo */);
        var data = {};
        data[2 /* GameServerInfo */] = {
            'name': gameServer.name
        };
        _super.prototype.setData.call(this, data);
    }
    return GameServerInfoMessage;
})(SubServerMessage);
module.exports = GameServerInfoMessage;
//# sourceMappingURL=GameServerInfoMessage.js.map