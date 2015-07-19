/**
 * Created by Alvys on 2015-06-14.
 */
import Sockets = require('../../core/connections/Sockets');
import Player = require('./Player');

/**
 * Represents a user connected to the gameserver
 */
class User {
    public id : number;
    public username: string;
    public connectorSocket : Sockets.Socket;

    public currentPlayer : Player;

    private _data: Object = {};

    constructor(id: number, username: string) {
        this.id = id;
        this.username = username;
    }

    public setConnector(socket: Sockets.Socket) : void {
        this.connectorSocket = socket;
    }

    public sendMessage(code: number, message : Object) {
        if (!this.connectorSocket) {
            return;
        }
        //message['c'] = this.id;
        message['p'] = [this.id];
        this.connectorSocket.sendMessage(code, message);
    }

    // TODO implement
    public isConnected() : boolean {
        return true;
    }

    public setData(key: string, data: Object) : void;
    public setData(key: number, data: Object) : void;
    public setData(key: any, data: Object) : void {
        this._data[key] = data;
    }

    public getData(key: string, defaultValue? : Object) : Object;
    public getData(key: number, defaultValue? : Object) : Object;
    public getData(key: any, defaultValue? : Object) : Object {
        if (this._data[key]) {
            return this._data[key];
        }
        return defaultValue;
    }
}

export = User;