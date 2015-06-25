var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GClientMessageHandler = require('../interfaces/GClientMessageHandler');
var MessageCode = require('../../common/MessageCode');
var JoinQueueHandler = (function (_super) {
    __extends(JoinQueueHandler, _super);
    function JoinQueueHandler() {
        _super.apply(this, arguments);
    }
    JoinQueueHandler.prototype.getMessageType = function () {
        return 6 /* JoinQueue */;
    };
    JoinQueueHandler.prototype.handleClient = function (message, user) {
        var username = message['username'];
        console.log("GOT MESSAGE: ".cyan);
        console.log(message);
    };
    return JoinQueueHandler;
})(GClientMessageHandler);
module.exports = JoinQueueHandler;
//# sourceMappingURL=JoinQueueHandler.js.map