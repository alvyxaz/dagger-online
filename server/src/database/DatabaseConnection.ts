/// <reference path='../types' />
import mongoose = require('mongoose');

class DatabaseConnection {

    public connect(dbAddress: string , successCallback : () => void) {
        var db = mongoose.connect(dbAddress).connection;
        db.once('open', successCallback);
        db.on('error', console.error.bind(console, 'connection error:'));
    }
}

export = DatabaseConnection;