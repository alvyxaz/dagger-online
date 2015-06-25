var Account = (function () {
    function Account(username, socket) {
        this.socket = socket;
        this.isConnectedToConnector = false;
        this.username = username;
    }
    Account.prototype.isConnectedToGame = function () {
        return this.isConnectedToConnector;
    };
    Account.prototype.markAsGuest = function () {
        this.isGuest = true;
    };
    return Account;
})();
module.exports = Account;
//# sourceMappingURL=Account.js.map