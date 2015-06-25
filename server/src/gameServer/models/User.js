var User = (function () {
    function User(id, username) {
        this.id = id;
        this.username = username;
    }
    User.prototype.setConnector = function (socket) {
        this.connectorSocket = socket;
    };
    User.prototype.sendMessage = function (code, message) {
        message['c'] = this.id;
        this.connectorSocket.sendMessage(code, message);
    };
    User.prototype.isConnected = function () {
        return true;
    };
    return User;
})();
module.exports = User;
//# sourceMappingURL=User.js.map