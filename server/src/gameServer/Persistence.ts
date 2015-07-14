/// <reference path='../types' />
import _ = require('lodash');
import fs = require('fs');

import mongoose = require('mongoose');
import Models = require('../database/Models');

import DatabaseConnection = require('../database/DatabaseConnection');

import Player = require('./models/Player');

class Persistence {
    private _dbConnection : DatabaseConnection;

    constructor(dbConnection: DatabaseConnection) {
        this._dbConnection = dbConnection;
    }

    public savePlayer(player: Player, isNew? : boolean) {
        if (!player.zone || !player) {
            console.log("Tried saving invalid player".red);
            return;
        }

        var playerData = {
            'username' : player.name,
            'position' : player.position.toArray(),
            'zone' : player.zone.name
        };

        Models.Player.findOneAndUpdate({'username' : player.name}, playerData, {'upsert': true}, (err : any) => {
            if (err) {
                console.log("Failed to save a player".red);
                console.log(err);
            } else {
                console.log("Player saved sucessfully: ".green);
                console.log(player.position.toArray());
            }
        });
    }
}

export = Persistence;