/// <reference path='../../types' />
import ObjectTemplate = require('../templates/ObjectTemplate');
import IdFactory = require('./IdFactory');
import GameObject = require('../models/GameObject');

class ObjectFactory {
    private _templates : Object = {};
    private _idFactory: IdFactory;

    constructor(idFactory : IdFactory) {
        this._idFactory;
    }

    public loadTemplates() : void {
        this.addTemplate({
            'name' : "box",
            'templateId' : "box"
        });
    }

    public createObject(templateId : string): GameObject {
        if (this._templates[templateId]) {
            var template = this._templates[templateId];
            return new GameObject(this._idFactory.generateInstanceId());
        }
        return undefined;
    }

    public addTemplate(template: ObjectTemplate){
        if (this._templates[template.templateId]) {
            console.log('ObjectTemplate with this id is already added: '.red + template.templateId);
            return;
        }
        this._templates[template.templateId] = template;
    }

    public getTemplate(templateId: string) {
        return this._templates[templateId];
    }
}

export = ObjectFactory;