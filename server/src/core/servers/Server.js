var SocketIO = require('socket.io');
var ParameterCode = require('../../common/ParameterCode');
var Server = (function () {
    function Server(type, name, port) {
        this.type = type;
        this.port = port;
        this.name = name;
    }
    Server.prototype.start = function (config) {
        console.warn("Not implemented server 'start' method");
    };
    Server.prototype.onServerStart = function (server) {
        console.log("Not overloaded");
    };
    Server.prototype.handleMessage = function (handlers, message, sender, ackCallback) {
        try {
            if (ackCallback) {
                var response = handlers[message['o']].handleAck(message, sender, ackCallback);
                if (response) {
                    ackCallback(response);
                }
            }
            else if (!handlers[message['o']].handle(message, sender)) {
                console.log((this.name + ': Failed to handle a message "' + message['o'] + '". Content').red);
                console.log(message);
            }
        }
        catch (exception) {
            console.log("AND HERE");
            if (ackCallback) {
                var res = {};
                res[-1 /* Error */] = 'Internal server error';
                ackCallback(res);
            }
            console.log((this.name + ': Failed to handle a message "' + message['o'] + '". Content').red);
            console.log(message);
            console.log(exception);
        }
    };
    return Server;
})();
module.exports = Server;
//# sourceMappingURL=Server.js.map