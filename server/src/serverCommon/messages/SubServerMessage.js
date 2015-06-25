var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Message = require('../../core/Messages/Message');
var SubServerMessage = (function (_super) {
    __extends(SubServerMessage, _super);
    function SubServerMessage(type) {
        _super.call(this, type);
    }
    return SubServerMessage;
})(Message);
module.exports = SubServerMessage;
//# sourceMappingURL=SubServerMessage.js.map