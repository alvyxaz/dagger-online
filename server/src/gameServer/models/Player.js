var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Character = require('./Character');
var GameObjectType = require('../enums/GameObjectType');
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(instanceId, user) {
        _super.call(this, instanceId);
    }
    Object.defineProperty(Player.prototype, "type", {
        get: function () {
            return 1 /* Character */;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
})(Character);
module.exports = Player;
//# sourceMappingURL=Player.js.map