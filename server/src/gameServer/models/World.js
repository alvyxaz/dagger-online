var World = (function () {
    function World() {
        this._tick = 0;
        this._players = [];
    }
    World.prototype.addPlayer = function (player) {
        if (!this.containsPlayer(player)) {
            this._players.push(player);
        }
    };
    World.prototype.removePlayer = function (player) {
        var index = this._players.indexOf(player);
        if (index > -1) {
            this._players.splice(index, 1);
        }
    };
    World.prototype.containsPlayer = function (player) {
        return this._players.indexOf(player) > -1;
    };
    World.prototype.updateTick = function () {
        this._tick += 1;
    };
    Object.defineProperty(World.prototype, "tick", {
        get: function () {
            return this._tick;
        },
        enumerable: true,
        configurable: true
    });
    return World;
})();
module.exports = World;
//# sourceMappingURL=World.js.map