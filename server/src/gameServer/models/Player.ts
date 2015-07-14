import Character = require('./Character');
import World = require('./World');
import User = require('./User');
import GameObjectType = require('../enums/GameObjectType');
/**
 * Created by Alvys on 2015-06-22.
 */
class Player extends Character{
    private _user: User;

    constructor(instanceId: number, user: User) {
        super(instanceId);
        this._user = user;
        this.name = user.username;
    }

    get type() : GameObjectType {return GameObjectType.Character;}
    get user() : User {return this._user;}
    get username() : string {return this._user.username;}

}

export = Player;