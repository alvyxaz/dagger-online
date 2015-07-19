import Zone = require('../models/Zone');

import ZoneTemplate = require('../templates/ZoneTemplate');
import ZoneType = require('../enums/ZoneType');

class ZoneFactory {
    private _templates : Object = {};

    constructor() {
        this.loadTemplates();
    }

    public loadTemplates() : void {
        // World
        this.addTemplate(require('../../../data/maps/world.json'));
    }
    public createZone(templateId : string): Zone {
        if (this._templates[templateId]) {
            return new Zone(this._templates[templateId]);
        }
        return undefined;
    }

    private addTemplate(template: ZoneTemplate){
        if (this._templates[template.templateId]) {
            console.log('ZoneTemplate with this id is already added: '.red + template.templateId);
            return;
        }
        this._templates[template.templateId] = template;
    }

    private getTemplate(templateId: string) {
        return this._templates[templateId];
    }
}

export = ZoneFactory;