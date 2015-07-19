import Character = require('./Character');
import World = require('./World');
import User = require('./User');
import GameObjectType = require('../enums/GameObjectType');

/**
 * Created by Alvys on 2015-06-22.
 */
class Player extends Character  {
    private _user: User;

    public isInGame: boolean = false;

    constructor(instanceId: number, user: User) {
        super(instanceId);
        this._user = user;
        this.name = user.username;
    }

    get type() : GameObjectType {return GameObjectType.Player;}
    get user() : User {return this._user;}
    get username() : string {return this._user.username;}

    public trySendMessage(code: number, message: Object) {
        this.sendMessage(code, message);
    }

    public sendMessage(code: number, message : Object) {
        if (this.isInGame) {
            this._user.sendMessage(code, message);
        }
    }
}

export = Player;