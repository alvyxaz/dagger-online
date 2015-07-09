import Character = require('./Character');
import World = require('./World');
import User = require('./User');
import GameObjectType = require('../enums/GameObjectType');
/**
 * Created by Alvys on 2015-06-22.
 */
class Player extends Character{
    private user: User;

    public username: String;

    constructor(instanceId: number, user: User) {
        super(instanceId);
    }

    get type() : GameObjectType {return GameObjectType.Character;}
}

export = Player;