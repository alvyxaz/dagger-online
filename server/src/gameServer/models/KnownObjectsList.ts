/**
 * Created by Alvys on 2015-06-24.
 */
/// <reference path='../../types' />
import GameObject = require('./GameObject');
import GameObjectType = require('../enums/GameObjectType');
import _ = require('lodash');

class KnownObjectsList {
    private _owner: GameObject;
    private _objects: {} = {}; // {id: obj; ...}
    private _interests : number;

    // Ignore flags
    constructor(owner: GameObject, interests?: Array<GameObjectType>) {
        this._owner = owner;
        if (interests) {
            interests.forEach((interest: GameObjectType) => {
                this._interests |= interest;
            });
        }
    }

    public addObject(object : GameObject) : boolean {
        if (!this.contains(object)) {
            this._objects[object.id] = object;
            object.knownObjects.addObject(this._owner);
            return true;
        }
        return false;
    }

    public removeObject(object: GameObject) : boolean {
        if (this.contains(object)) {
            delete this._objects[object.id];
            object.knownObjects.removeObject(this._owner);
            return true;
        }
        return false;
    }

    public contains (object: GameObject) {
        return this._objects[object.id] ? true : false;
    }

    //public caresAbout(objType: GameObjectType) {
    //    return (this._interests & objType) > 0;
    //}

    public clear() : void {
        for(var key in this._objects) {
            this.removeObject(this._objects[key]);
        }
    }
}

export = KnownObjectsList;