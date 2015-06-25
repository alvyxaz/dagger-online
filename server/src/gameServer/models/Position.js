var Position = (function () {
    function Position(x, y) {
        this.pos = [x, y];
    }
    Object.defineProperty(Position.prototype, "x", {
        get: function () {
            return this.pos[0];
        },
        set: function (x) {
            this.pos[0] = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "y", {
        get: function () {
            return this.pos[1];
        },
        set: function (y) {
            this.pos[1] = y;
        },
        enumerable: true,
        configurable: true
    });
    Position.prototype.set = function (x, y) {
        this.pos[0] = x;
        this.pos[1] = y;
    };
    Position.prototype.distanceTo = function (target) {
        var pos = this.pos;
        return Math.sqrt(this.sqrDistanceTo(target));
    };
    Position.prototype.sqrDistanceTo = function (target) {
        return (target.x - this.x) * (target.x - this.x) + (target.y - this.y) * (target.y - this.y);
    };
    Position.prototype.offsetByAngle = function (angle, offset) {
        this.x += Math.cos(angle) * offset;
        this.y += Math.sin(angle) * offset;
    };
    return Position;
})();
module.exports = Position;
//# sourceMappingURL=Position.js.map