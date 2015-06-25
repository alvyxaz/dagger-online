/// <reference path='../../types' />
import _ = require('lodash');

import GameObject = require('./GameObject');
import Player =  require('./Player');

class World {
    private _tick : number;
    private _players : Array<Player>;

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
        var index = this._players.indexOf(player);
        if (index > -1) {
            this._players.splice(index, 1);
        }
    }

    public containsPlayer(player: Player) {
        return this._players.indexOf(player) > -1;
    }

    public updateTick() {
        this._tick += 1;
    }

    get tick() : number {return this._tick;}
}

export = World;