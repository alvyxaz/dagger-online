var KnownObjectsList = (function () {
    function KnownObjectsList(owner, interests) {
        var _this = this;
        this._objects = {};
        this._owner = owner;
        if (interests) {
            interests.forEach(function (interest) {
                _this._interests |= interest;
            });
        }
    }
    KnownObjectsList.prototype.addObject = function (object) {
        if (!this.contains(object)) {
            this._objects[object.id] = object;
            object.knownObjects.addObject(this._owner);
            return true;
        }
        return false;
    };
    KnownObjectsList.prototype.removeObject = function (object) {
        if (this.contains(object)) {
            delete this._objects[object.id];
            object.knownObjects.removeObject(this._owner);
            return true;
        }
        return false;
    };
    KnownObjectsList.prototype.contains = function (object) {
        return this._objects[object.id] ? true : false;
    };
    KnownObjectsList.prototype.clear = function () {
        for (var key in this._objects) {
            this.removeObject(this._objects[key]);
        }
    };
    return KnownObjectsList;
})();
module.exports = KnownObjectsList;
//# sourceMappingURL=KnownObjectsList.js.map