import Zone = require('../models/Zone');

import ZoneTemplate = require('../templates/ZoneTemplate');
import ZoneType = require('../enums/ZoneType');
import Spawn = require('../modules/Spawn');

import ObjectFacory = require('../factories/ObjectFactory');

class ZoneFactory {
    private _templates : Object = {};

    private _objectFactory: ObjectFacory;

    constructor(objectFactory: ObjectFacory) {
        this._objectFactory = objectFactory;
    }

    public loadTemplates() : void {
        // World
        this.addTemplate(require('../../../data/maps/world.json'));
    }
    public createZone(templateId : string): Zone {
        var template: ZoneTemplate = this._templates[templateId];

        if (template) {
            var zone =  new Zone(template);

            if (template.data.spawns) {
                template.data.spawns.forEach((spawnData: Spawn.SpawnData) => {
                    var spawn = new Spawn.SpawnController(spawnData, zone);

                    for (var i = 0; i < spawnData.count; i++) {
                        var gameObject = this._objectFactory.createObject(spawnData.template);
                        if (gameObject) {
                            spawn.addSpawn(gameObject)
                        }
                    }
                });
            }

            return zone;
        }
        return undefined;
    }

    public addTemplate(template: ZoneTemplate){
        if (this._templates[template.templateId]) {
            console.log('ZoneTemplate with this id is already added: '.red + template.templateId);
            return;
        }
        this._templates[template.templateId] = template;
    }

    public getTemplate(templateId: string) {
        return this._templates[templateId];
    }
}

export = ZoneFactory;