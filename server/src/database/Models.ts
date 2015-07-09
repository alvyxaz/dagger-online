/// <reference path='../types' />
import mongoose = require('mongoose');
import Schemas = require('./Schemas');

declare module Models {
    export interface IAccount extends mongoose.Document {
        'username' : string;
        'password' : string;
        'salt' : string;
        'email' : string;
    }

    export interface IPlayer extends mongoose.Document {
        'username' : string;
        'position' : Array<number>;
        'zone' : string;
    }
}

class Models {
    public Account : mongoose.Model<Models.IAccount> = mongoose.model<Models.IAccount>('Account', Schemas.accountSchema);
    public Player : mongoose.Model<Models.IPlayer> = mongoose.model<Models.IPlayer>('Player', Schemas.playerSchema);
}

var models : Models = new Models();
export = models;
