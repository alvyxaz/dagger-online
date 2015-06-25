var SocketIO = require('socket.io');
var io = require('socket.io-client');
var SocketIOSockets;
(function (SocketIOSockets) {
    var Server = (function () {
        function Server() {
        }
        Server.prototype.open = function (port) {
            this.io = new SocketIO(port);
        };
        Server.prototype.onConnection = function (callback) {
            this.io.on('connection', function (socket) {
                callback(new ServerSocket(socket));
            });
            return this;
        };
        Server.prototype.on = function (event, listener) {
            this.io.on(event, listener);
            return this;
        };
        return Server;
    })();
    SocketIOSockets.Server = Server;
    var ServerSocket = (function () {
        function ServerSocket(socket) {
            this.data = {};
            this.socket = socket;
        }
        ServerSocket.prototype.getSid = function () {
            return this.socket.id;
        };
        ServerSocket.prototype.onMessage = function (callback) {
            this.socket.on('message', callback);
        };
        ServerSocket.prototype.onDisconnect = function (callback) {
            this.socket.on('disconnect', callback);
        };
        ServerSocket.prototype.emit = function (event, args, callback) {
            this.socket.emit(event, args, callback);
        };
        ServerSocket.prototype.sendMessage = function (code, args, callback) {
            args['o'] = code;
            this.emit('message', args, callback);
        };
        ServerSocket.prototype.setData = function (key, data) {
            this.data[key] = data;
        };
        ServerSocket.prototype.getData = function (key) {
            return this.data[key];
        };
        ServerSocket.prototype.isConnected = function () {
            return this.socket.connected;
        };
        return ServerSocket;
    })();
    SocketIOSockets.ServerSocket = ServerSocket;
    var Client = (function () {
        function Client() {
        }
        Client.prototype.connect = function (address, options) {
            this.innerSocket = io.connect(address, options);
            this.socket = new ClientSocket(this.innerSocket);
            return this.socket;
        };
        return Client;
    })();
    SocketIOSockets.Client = Client;
    var ClientSocket = (function () {
        function ClientSocket(socket) {
            this.data = {};
            this.socket = socket;
            this.id = Math.floor((Math.random() * 100000) + 1);
        }
        ClientSocket.prototype.getSid = function () {
            return this.id + '';
        };
        ClientSocket.prototype.onMessage = function (callback) {
            this.socket.on('message', callback);
        };
        ClientSocket.prototype.onConnect = function (callback) {
            this.socket.on('connect', callback);
        };
        ClientSocket.prototype.onConnectError = function (callback) {
            this.socket.on('connect_error', callback);
        };
        ClientSocket.prototype.onDisconnect = function (callback) {
            this.socket.on('disconnect', callback);
        };
        ClientSocket.prototype.emit = function (event, args, callback) {
            this.socket.emit(event, args, callback);
        };
        ClientSocket.prototype.sendMessage = function (code, args, callback) {
            args['o'] = code;
            this.emit('message', args, callback);
        };
        ClientSocket.prototype.setData = function (key, data) {
            this.data[key] = data;
        };
        ClientSocket.prototype.getData = function (key) {
            return this.data[key];
        };
        ClientSocket.prototype.isConnected = function () {
            return this.socket.connected;
        };
        return ClientSocket;
    })();
    SocketIOSockets.ClientSocket = ClientSocket;
})(SocketIOSockets || (SocketIOSockets = {}));
module.exports = SocketIOSockets;
//# sourceMappingURL=SocketIOSockets.js.map