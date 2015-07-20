import GameObject = require('./GameObject');
import GameObjectType = require('../enums/GameObjectType');
import ObjectTemplate = require('../templates/ObjectTemplate');

class Character extends GameObject {
    constructor(instanceId: number, template?: ObjectTemplate) {
        super(instanceId, template);
    }

    get type() : GameObjectType {return GameObjectType.Character;}
}

export = Character;