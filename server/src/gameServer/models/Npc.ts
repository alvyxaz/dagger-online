import Character = require('./Character');
import World = require('./World');
import User = require('./User');
import GameObjectType = require('../enums/GameObjectType');
import NpcTemplate = require('../templates/NpcTemplate');

/**
 * Created by Alvys on 2015-06-22.
 */
class Npc extends Character  {
    public isInGame: boolean = false;

    constructor(instanceId: number, template: NpcTemplate) {
        super(instanceId);
        this.name = template.name;
    }

    get type() : GameObjectType {return GameObjectType.Npc;}
}

export = Npc;