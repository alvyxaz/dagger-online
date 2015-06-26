var defaultTemplate = {};
var StatHolder = (function () {
    function StatHolder() {
    }
    StatHolder.prototype.GetStat = function (stat) {
        return 0;
    };
    StatHolder.prototype.addModifier = function () {
    };
    StatHolder.prototype.setStat = function (stat, value) {
    };
    StatHolder.prototype.calculateStat = function (stat, target) {
    };
    StatHolder.createStatHolder = function (template) {
        return new StatHolder();
    };
    return StatHolder;
})();
var Stat = (function () {
    function Stat(baseValue) {
        this._baseValue = baseValue;
    }
    return Stat;
})();
//# sourceMappingURL=StatHolder.js.map