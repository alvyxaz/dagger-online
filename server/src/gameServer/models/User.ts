/**
 * Created by Alvys on 2015-06-14.
 */
import Sockets = require('../../core/connections/Sockets');

/**
 * Represents a user connected to the gameserver
 */
class User {
    public id : number;
    public username: string;
    public connectorSocket : Sockets.Socket;

    constructor(id: number, username: string) {
        this.id = id;
        this.username = username;
    }

    public setConnector(socket: Sockets.Socket) : void {
        this.connectorSocket = socket;
    }

    public sendMessage(code: number, message : Object) {
        message['c'] = this.id;
        this.connectorSocket.sendMessage(code, message);
    }

    // TODO implement
    public isConnected() : boolean {
        return true;
    }
}

export = User;