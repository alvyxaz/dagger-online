var Position = require('./Position');
var DEFAULT_BLOCK_SIZE = 30;
var Zone = (function () {
    function Zone(template) {
        this._positionData = {};
        this._visibleRange = 30;
        this._forgetRange = 60;
        this._template = template;
        this._objects = [];
        this._players = [];
        if (template.area) {
            this._visibleRange = template.area.visibleRange;
            this._forgetRange = template.area.forgetRange;
        }
    }
    Object.defineProperty(Zone.prototype, "name", {
        get: function () {
            return this._template.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "maxPlayers", {
        get: function () {
            return this._template.maxPlayers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "type", {
        get: function () {
            return this._template.type;
        },
        enumerable: true,
        configurable: true
    });
    Zone.prototype.setObjectPosition = function (object, x, y) {
        var zonePosition = this._positionData[object.id];
        if (zonePosition) {
            zonePosition.position.set(x, y);
            this.updateKnownList(object);
        }
    };
    Zone.prototype.updateKnownList = function (owner) {
        var visibleRange = this._visibleRange;
        var forgetRange = this._forgetRange;
        var allObjects = this._objects;
        for (var i = 0; i < allObjects.length; i++) {
            var target = allObjects[i];
            if (owner === target) {
                continue;
            }
            if (owner.knownObjects.contains(target)) {
                if (owner.position.distanceTo(target.position) > forgetRange) {
                    owner.knownObjects.removeObject(target);
                }
            }
            else {
                if (owner.position.distanceTo(target.position) <= visibleRange) {
                    owner.knownObjects.addObject(target);
                }
            }
        }
    };
    Zone.prototype.addObject = function (object, position) {
        if (!this.containsObject(object)) {
            this._objects.push(object);
            var position = new Position(position.x, position.y);
            var zonePosition = {
                'position': position
            };
            this._positionData[object.id] = zonePosition;
            object.setZone(this, position);
            this.setObjectPosition(object, position.x, position.y);
            return true;
        }
        return false;
    };
    Zone.prototype.removeObject = function (object) {
        var index = this._objects.indexOf(object);
        if (index > -1) {
            this._objects.splice(index, 1);
            object.zone = null;
            object.knownObjects.clear();
            delete this._positionData[object.id];
            object.onRemovedFromZone();
        }
    };
    Zone.prototype.getObjectPosition = function (object) {
        var zonePosition = this._positionData[object.id];
        if (zonePosition) {
            return zonePosition.position;
        }
        return null;
    };
    Zone.prototype.containsObject = function (object) {
        return this._objects.indexOf(object) > -1;
    };
    Zone.prototype.addPlayer = function (player, position) {
        if (this._players.length < this.maxPlayers && !this.containsPlayer(player)) {
            if (this.addObject(player, position)) {
                this._players.push(player);
                return true;
            }
        }
        return false;
    };
    Zone.prototype.removePlayer = function (player) {
        var index = this._players.indexOf(player);
        if (index > -1) {
            this.removeObject(player);
            this._players.splice(index, 1);
        }
    };
    Zone.prototype.containsPlayer = function (player) {
        return this._players.indexOf(player) > -1;
    };
    return Zone;
})();
module.exports = Zone;
//# sourceMappingURL=Zone.js.map