import Character = require('./Character');
import World = require('./World');
import User = require('./User');
import GameObjectType = require('../enums/GameObjectType');
/**
 * Created by Alvys on 2015-06-22.
 */
class Player extends Character{
    private _user: User;

    public username: String;

    constructor(instanceId: number, user: User) {
        super(instanceId);
        this._user = user;
    }

    get type() : GameObjectType {return GameObjectType.Character;}
    get user() : User {return this._user;}
}

export = Player;