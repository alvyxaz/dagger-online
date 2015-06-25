/**
 * Created by Alvys on 2015-06-16.
 */
import GameType = require('../common/GameType');
import User = require('./models/User');
import _ = require('lodash');
import GameServer = require('./GameServer');
import events = require('events');
import MessageCode = require('../common/MessageCode');

class QueueManager {
    private server: GameServer;
    private queues : Array<GameQueue> = [];

    constructor(server : GameServer) {
        this.server = server;
    }

    private getQueue(gameType: GameType, user : User) : GameQueue{
        return _.find(this.queues, (queue: GameQueue) => {
            return queue.type === gameType && !queue.isLocked() && !queue.isUserAdded(user) ;
        })
    }

    public addUser(user: User, gameTypes: Array<GameType>) {
        gameTypes.forEach((type: GameType) => {
            var queue = this.getQueue(type, user);
            if (!queue) {
                var newQueue = new GameQueue(this, type);
                this.queues.push(newQueue);
            }
        });
    }

    public removeUser(user: User) {
        this.queues.forEach((queue: GameQueue) => {
            if (queue.isUserAdded(user)) {
                queue.removeUser(user);
            }
        });
    }
}

class GameQueue {
    public users: Array<User> = [];
    public type: GameType;
    public playerCount: number;

    private _isLocket: boolean;
    private _manager : QueueManager;

    constructor(manager: QueueManager, gameType : GameType) {
        this.type = gameType;
        this._isLocket = false;
        this._manager = manager;

        switch(gameType) {
            case GameType.Deathmatch2 :
                this.playerCount = 2;
                break;
            case GameType.Deathmatch4 :
                this.playerCount = 4;
                break;
            default:
                console.log("GameQueue did not have a player count specified".red);
                break;
        }
    }

    private lock() {
        this._isLocket = true;
    }

    private unlock() {
        this._isLocket = false;
    }

    public isLocked() {
        return this._isLocket;
    }

    public isFull() {
        return this.users.length >= this.playerCount;
    }

    public isUserAdded(user: User) {
        return _.contains(this.users, user);
    }

    private onPlayerCountChanged() : void {
        if (this.users.length === this.playerCount) {
            this.lock();
            this.cleanupInactive();

            if (this.isFull()) {
                // If we're still full after cleanup
                // TODO remove players from all other queues
            } else {
                // Unlock queue to allow more players
                // TODO put players back to original queues
                this.unlock();
            }
        }
    }

    private sendConfirmRequest() : void {
        var timeout = 10; // seconds

        // Send notifications to users
        this.users.forEach((user: User) => {
            user.sendMessage(MessageCode.JoinQueue, {
                'state' : 'start',
                'timeout' : timeout // seconds
            });
        })

        setTimeout(() => {
            if ( false) {
                // At least one of the users did not confirm
                this.sendQueueCancel();
            } else {
                // All of the users confirmed. We can get the game ready now
            }
        }, timeout *1000);
    }

    private sendQueueCancel() : void {
        this.users.forEach((user: User) => {
            user.sendMessage(MessageCode.JoinQueue, {
                'state' : 'cancel',
            });
        })
    }

    private cleanupInactive() : void {
        var removed = _.remove(this.users, (user: User) => {
            return !user.isConnected();
        })

        // Make sure that inactive user are removed from manager
        removed.forEach((user: User) => {
           this._manager.removeUser(user);
        });
    }

    public addUser(user: User) {
        if (!_.contains(this.users, user)) {
            this.users.push(user);
            this.onPlayerCountChanged();
        }
    }

    public removeUser(user: User) {
        var removedUsers = _.remove(this.users, (tempUser: User) => {
            return tempUser === user;
        });

        if (removedUsers.length > 0) {
            this.onPlayerCountChanged();
        }
    }
}

export = QueueManager;