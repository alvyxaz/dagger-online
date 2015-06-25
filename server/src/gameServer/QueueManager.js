var GameType = require('../common/GameType');
var _ = require('lodash');
var MessageCode = require('../common/MessageCode');
var QueueManager = (function () {
    function QueueManager(server) {
        this.queues = [];
        this.server = server;
    }
    QueueManager.prototype.getQueue = function (gameType, user) {
        return _.find(this.queues, function (queue) {
            return queue.type === gameType && !queue.isLocked() && !queue.isUserAdded(user);
        });
    };
    QueueManager.prototype.addUser = function (user, gameTypes) {
        var _this = this;
        gameTypes.forEach(function (type) {
            var queue = _this.getQueue(type, user);
            if (!queue) {
                var newQueue = new GameQueue(_this, type);
                _this.queues.push(newQueue);
            }
        });
    };
    QueueManager.prototype.removeUser = function (user) {
        this.queues.forEach(function (queue) {
            if (queue.isUserAdded(user)) {
                queue.removeUser(user);
            }
        });
    };
    return QueueManager;
})();
var GameQueue = (function () {
    function GameQueue(manager, gameType) {
        this.users = [];
        this.type = gameType;
        this._isLocket = false;
        this._manager = manager;
        switch (gameType) {
            case 0 /* Deathmatch2 */:
                this.playerCount = 2;
                break;
            case 1 /* Deathmatch4 */:
                this.playerCount = 4;
                break;
            default:
                console.log("GameQueue did not have a player count specified".red);
                break;
        }
    }
    GameQueue.prototype.lock = function () {
        this._isLocket = true;
    };
    GameQueue.prototype.unlock = function () {
        this._isLocket = false;
    };
    GameQueue.prototype.isLocked = function () {
        return this._isLocket;
    };
    GameQueue.prototype.isFull = function () {
        return this.users.length >= this.playerCount;
    };
    GameQueue.prototype.isUserAdded = function (user) {
        return _.contains(this.users, user);
    };
    GameQueue.prototype.onPlayerCountChanged = function () {
        if (this.users.length === this.playerCount) {
            this.lock();
            this.cleanupInactive();
            if (this.isFull()) {
            }
            else {
                this.unlock();
            }
        }
    };
    GameQueue.prototype.sendConfirmRequest = function () {
        var _this = this;
        var timeout = 10;
        this.users.forEach(function (user) {
            user.sendMessage(6 /* JoinQueue */, {
                'state': 'start',
                'timeout': timeout
            });
        });
        setTimeout(function () {
            if (false) {
                _this.sendQueueCancel();
            }
            else {
            }
        }, timeout * 1000);
    };
    GameQueue.prototype.sendQueueCancel = function () {
        this.users.forEach(function (user) {
            user.sendMessage(6 /* JoinQueue */, {
                'state': 'cancel',
            });
        });
    };
    GameQueue.prototype.cleanupInactive = function () {
        var _this = this;
        var removed = _.remove(this.users, function (user) {
            return !user.isConnected();
        });
        removed.forEach(function (user) {
            _this._manager.removeUser(user);
        });
    };
    GameQueue.prototype.addUser = function (user) {
        if (!_.contains(this.users, user)) {
            this.users.push(user);
            this.onPlayerCountChanged();
        }
    };
    GameQueue.prototype.removeUser = function (user) {
        var removedUsers = _.remove(this.users, function (tempUser) {
            return tempUser === user;
        });
        if (removedUsers.length > 0) {
            this.onPlayerCountChanged();
        }
    };
    return GameQueue;
})();
module.exports = QueueManager;
//# sourceMappingURL=QueueManager.js.map