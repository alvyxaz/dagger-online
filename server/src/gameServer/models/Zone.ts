/// <reference path='../../types' />
import _ = require('lodash');

import GameObject = require('./GameObject');
import Player = require('./Player');
import Position = require('./Position');
import ZoneTemplate = require('../interfaces/ZoneTemplate');
import ZoneType = require('../enums/ZoneType');
import GameObjectType = require('../enums/GameObjectType');

var DEFAULT_BLOCK_SIZE = 30;

class Zone {
    private _objects: Array<GameObject>;
    private _players: Array<Player>;
    private _template: ZoneTemplate;
    private _positionData: {} = {} // {id : ZonePosition}

    private _visibleRange = 30;
    private _forgetRange = 60;
    private _markedPositions: Array<Object>;

    constructor(template: ZoneTemplate) {
        this._template = template;
        this._objects = [];
        this._players = [];
        this._markedPositions = template.positions;

        if (template.area) {
            this._visibleRange = template.area.visibleRange;
            this._forgetRange = template.area.forgetRange;
        }
    }

    // Template accessors
    get name() : string {return this._template.name;}
    get maxPlayers() : number {return this._template.maxPlayers;}
    get type() : ZoneType {return this._template.type;}
    get template() : ZoneTemplate {return this._template;}

    public getPosition (name: string) : Array<number> {
        var position : Object = _.find(this._markedPositions, (markedPosition) => {
            return markedPosition['name'] === name;
        });

        return position ? position['position'] : null;
    }

    public setObjectPosition(object: GameObject, x : number, y: number) {
        var zonePosition: ZonePosition = this._positionData[object.id];
        if (zonePosition) {
            zonePosition.position.set(x, y);
            this.updateKnownList(object);
        }
    }

    public updateKnownList(owner: GameObject) {
        var visibleRange = this._visibleRange
        var forgetRange = this._forgetRange;
        var allObjects = this._objects;
        for (var i = 0; i < allObjects.length; i++) {
            var target = allObjects[i];
            if (owner === target) {
                continue;
            }
            if (owner.knownObjects.contains(target)) {
                // Owner already knows about the target
                if (owner.position.distanceTo(target.position) > forgetRange) {
                    owner.knownObjects.removeObject(target);
                }
            } else {
                // Owner doesn't know about target
                if (owner.position.distanceTo(target.position) <= visibleRange) {
                    owner.knownObjects.addObject(target);
                }
            }
        }
    }

    public addObject(object: GameObject, position: Position) : boolean {
        if (!this.containsObject(object)) {
            this._objects.push(object);
            var position = new Position(position.x, position.y);
            // Setup a position for the object
            var zonePosition: ZonePosition = {
                'position' : position
            };
            this._positionData[object.id] = zonePosition;
            object.setZone(this, position);
            this.setObjectPosition(object, position.x, position.y);
            return true;
        }
        return false;
    }

    public removeObject(object : GameObject){
        var index = this._objects.indexOf(object);
        if (index > -1) {
            this._objects.splice(index, 1);
            object.zone = null;
            object.knownObjects.clear();
            delete this._positionData[object.id];
            object.onRemovedFromZone();
        }
    }

    public getObjectPosition(object : GameObject) {
        var zonePosition: ZonePosition = this._positionData[object.id];
        if (zonePosition) {
            return zonePosition.position;
        }
        return null;
    }

    public containsObject(object: GameObject) : boolean{
        return this._objects.indexOf(object) > -1;
    }

    public addPlayer(player: Player, position: Position) : boolean {
        if (this._players.length < this.maxPlayers && !this.containsPlayer(player)) {
            if (this.addObject(player, position)) {
                this._players.push(player);
                return true;
            }
        }
        return false;
    }

    public removePlayer(player: Player) {
        var index = this._players.indexOf(player);
        if (index > -1) {
            this.removeObject(player);
            this._players.splice(index, 1);
        }
    }

    public containsPlayer(player: Player) {
        return this._players.indexOf(player) > -1;
    }
}

/**
 * Represents game objects position in the zone
 */
interface ZonePosition {
    position: Position;
}

export = Zone;