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
}

class Models {
    public Account : mongoose.Model<Models.IAccount> = mongoose.model<Models.IAccount>('Account', Schemas.accountSchema);
}

var models : Models = new Models();
export = models;
