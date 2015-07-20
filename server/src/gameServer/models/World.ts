/// <reference path='../../types' />
import _ = require('lodash');

import GameObject = require('./GameObject');
import Player =  require('./Player');
import Zone = require('./Zone');

import IdFactory = require('../factories/IdFactory');

class World implements IdFactory{
    private _tick : number;
    private _players : Array<Player>;
    private _lastId = 0;

    private _starterZone: Zone;

    private _zones: Array<Zone> = [];

    constructor() {
        this._tick = 0;
        this._players = [];
    }

    public addPlayer(player: Player) {
        if (!this.containsPlayer(player)) {
            this._players.push(player);
        }
    }

    public removePlayer(player: Player) {
        if (!player) {
            return;
        }

        var foundPlayer = _.find(this._players, (tempPlayer) => {
            return player.username === tempPlayer.username;
        });

        if (foundPlayer) {
            var index = this._players.indexOf(foundPlayer);
            if (index > -1) {
                this._players.splice(index, 1);
            }
        }
    }

    public addZone(zone: Zone) {
        if (!_.include(this._zones, zone)) {
            this._zones.push(zone);
        }
    }

    public containsPlayer(player: Player) {
        var player = _.find(this._players, (tempPlayer) => {
            return player.username === tempPlayer.username;
        });
        return player ? true : false;
    }

    public generateInstanceId() : number  {
        this._lastId++;
        return this._lastId;
    }

    public updateTick(interval : number) {
        this._tick += 1;
    }

    public getZoneByName(name: string) : Zone {
        return _.find(this._zones, (zone: Zone) => {
            return zone.name === name;
        });
    }

    public getStarterZone() : Zone {
        return this._starterZone;
    }

    set starterZone(zone: Zone) {
        if (this._starterZone) {
            console.log("Started zone was allready added. There might be an error. Zone '".red
                + this._starterZone.name.cyan + "' changed to '".red + zone.name.cyan + "'".red)
        }
        this.addZone(zone);
        this._starterZone = zone;
    }

    get tick() : number {return this._tick;}
}

export = World;