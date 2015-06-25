/**
 * Created by Alvys on 2015-06-05.
 */

import Sockets = require('../../core/connections/Sockets');

class Account {
    public username : string;
    private isConnectedToConnector : boolean;
    public socket: Sockets.Socket;
    public isGuest : boolean;

    constructor(username : string, socket : Sockets.Socket) {
        this.socket = socket;
        this.isConnectedToConnector = false;
        this.username = username;
    }

    public isConnectedToGame() : boolean {
        return this.isConnectedToConnector;
    }

    public markAsGuest() : void {
        this.isGuest = true;
    }
}

export = Account;