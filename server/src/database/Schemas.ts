/// <reference path='../types' />
import mongoose = require('mongoose');

class Schemas {
    public accountSchema : mongoose.Schema = new mongoose.Schema({
        'username' : {type:  String, unique : true},
        'password' : String,
        'salt' : String,
        'email' : {type:  String, unique : true},
    }, {
        'collection' : 'accounts'
    });
}

var schemas : Schemas = new Schemas();
export = schemas;
