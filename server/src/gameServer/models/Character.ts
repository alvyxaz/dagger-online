import GameObject = require('./GameObject');
import GameObjectType = require('../enums/GameObjectType');

class Character extends GameObject {
    constructor(instanceId: number) {
        super(instanceId);
    }

    get type() : GameObjectType {return GameObjectType.Character;}
}

export = Character;