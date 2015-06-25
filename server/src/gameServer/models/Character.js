var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameObject = require('./GameObject');
var GameObjectType = require('../enums/GameObjectType');
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(instanceId) {
        _super.call(this, instanceId);
    }
    Object.defineProperty(Character.prototype, "type", {
        get: function () {
            return 1 /* Character */;
        },
        enumerable: true,
        configurable: true
    });
    return Character;
})(GameObject);
module.exports = Character;
//# sourceMappingURL=Character.js.map