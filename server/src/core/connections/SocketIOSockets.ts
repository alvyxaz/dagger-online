/**
 * Created by Alvys on 2015-06-02.
 */
/// <reference path='../../types' />

import Sockets = require('./Sockets');
var SocketIO = require('socket.io');
var io = require('socket.io-client');

import SocketData = require('../../serverCommon/SocketData');

module SocketIOSockets {
    export class Server implements Sockets.Server {
        private io : SocketIO.Server;

        open(port : number) : void {
            this.io = new SocketIO(port);
        }

        public onConnection(callback : (socket : Sockets.ServerSocket) => void): Server {
            this.io.on('connection', (socket: SocketIO.Socket) => {
                callback(new ServerSocket(socket));
            });
            return this;
        }

        on(event: string, listener: Function): Server {
            this.io.on(event, listener);
            return this;
        }
    }

    export class ServerSocket implements Sockets.ServerSocket {
        private socket : SocketIO.Socket;
        private data: Object;

        constructor(socket: SocketIO.Socket) {
            this.data = {};
            this.socket = socket;
        }

        public getSid() : string {
            return this.socket.id;
        }

        public onMessage(callback : (data : any, callback?: (data: any) => void) => void): void {
            this.socket.on('message', callback);
        }

        public onDisconnect(callback : () => void): void {
            this.socket.on('disconnect', callback);
        }

        public emit(event: string, args: any, callback? : (data: Object) => void): void {
            this.socket.emit(event, args, callback);
        }

        public sendMessage(code : number, args: Object, callback? : (data: Object) => void) : void {
            args['o'] = code;
            this.emit('message', args, callback);
        }

        public setData(key : SocketData, data: Object) : void {
            this.data[key] = data;
        }

        public getData(key : SocketData) : any {
            return this.data[key];
        }

        public isConnected() : boolean {
            return this.socket.connected;
        }

        //on(event: string, listener: Function): ServerSocket {
        //    //this.io.on(event, listener);
        //    return this;
        //}
    }

    export class Client implements Sockets.Client {
        private innerSocket : SocketIOClient.Socket;
        public socket: Sockets.ClientSocket;

        public connect(address: string, options : Object) : Sockets.ClientSocket {
            this.innerSocket = io.connect(address, options);
            this.socket = new ClientSocket(this.innerSocket);
            return this.socket;
        }
    }

    export class ClientSocket implements Sockets.ClientSocket {
        private socket : SocketIOClient.Socket;
        private data: Object;
        private id: number;

        constructor(socket: SocketIOClient.Socket) {
            this.data = {};
            this.socket = socket;
            this.id = Math.floor((Math.random() * 100000) + 1);
        }

        public getSid() : string {
            return this.id + '';
        }

        public onMessage(callback : (data : any, callback?: (data: any) => void) => void): void {
            this.socket.on('message', callback);
        }

        public onConnect(callback : () => void): void {
            this.socket.on('connect', callback);
        }

        public onConnectError(callback : (error: any) => void): void {
            this.socket.on('connect_error', callback);
        }

        public onDisconnect(callback : () => void): void {
            this.socket.on('disconnect', callback);
        }

        public emit(event: string, args: any, callback? : (data: Object) => void): void {
            this.socket.emit(event, args, callback);
        }

        public sendMessage(code : number, args: Object, callback? : (data: Object) => void) : void {
            args['o'] = code;
            this.emit('message', args, callback);
        }

        public setData(key : SocketData, data: Object) : void {
            this.data[key] = data;
        }

        public getData(key : SocketData) : any {
            return this.data[key];
        }

        public isConnected() : boolean {
            return this.socket.connected;
        }

        //on(event: string, listener: Function): ServerSocket {
        //    //this.io.on(event, listener);
        //    return this;
        //}
    }
}

export = SocketIOSockets;