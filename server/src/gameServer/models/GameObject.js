var KnownObjectsList = require('./KnownObjectsList');
var GameObjectType = require('../enums/GameObjectType');
var GameObject = (function () {
    function GameObject(id) {
        this._instanceId = id;
        this._knownObjects = new KnownObjectsList(this);
    }
    Object.defineProperty(GameObject.prototype, "id", {
        get: function () {
            return this._instanceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "type", {
        get: function () {
            return 15 /* Any */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (position) {
            if (this._zone) {
                this._zone.setObjectPosition(this, position.x, position.y);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "knownObjects", {
        get: function () {
            return this._knownObjects;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.setPosition = function (x, y) {
        this._position.x = x;
        this._position.y = y;
    };
    Object.defineProperty(GameObject.prototype, "zone", {
        get: function () {
            return this._zone;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.setZone = function (zone, position) {
        this._zone = zone;
        this._position = position;
    };
    GameObject.prototype.onRemovedFromZone = function () {
        this._zone = null;
        this._position = null;
    };
    return GameObject;
})();
module.exports = GameObject;
//# sourceMappingURL=GameObject.js.map