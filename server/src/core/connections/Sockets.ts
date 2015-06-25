/// <reference path='../../types' />

import SocketData = require('../../serverCommon/SocketData');

declare module Sockets {
    // Generic Socket
    interface Socket {
        getSid() : string;
        onMessage(callback : (data : any, callback?: (data: any) => void) => void): void;
        onDisconnect(callback : (data : any) => void): void;
        sendMessage(code : number, args: any, callback? : (data: Object) => void) : void;
        emit(event: string, args: any, callback? : (data: Object) => void): void;
        setData(key : SocketData, data: Object) : void;
        getData(key : SocketData) : any;
        isConnected() : boolean;
    }

    interface Server {
        open(port: number) : void;
        onConnection(callback : (socket : Sockets.ServerSocket) => void): Server;
        on(event: string, listener: Function): Server;
    }

    // Received in server, when client connects to it
    interface ServerSocket  extends Socket{
        //onMessage(callback : (data : any) => void): void;
        //on(event: string, listener: Function): ServerSocket;
    }

    interface Client{
        connect(address: string, options : Object) : ClientSocket;
    }

    // Received in client, when it connects to server
    interface ClientSocket extends Socket{
        onConnect(listener: () => void) :void;
        onConnectError(listener: (error: any) => void) :void;
        //on(event: 'message', listener: Function): ClientSocket;
        //on(event: string, listener: Function): ClientSocket;
    }
}

export = Sockets;