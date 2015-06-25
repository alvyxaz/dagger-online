var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ClientMessageHandler = require('../interfaces/ClientMessageHandler');
var MessageCode = require('../../common/MessageCode');
var SocketData = require('../../serverCommon/SocketData');
var Models = require('../../database/Models');
var Account = require('../models/Account');
var _ = require('lodash');
var LoginHandler = (function (_super) {
    __extends(LoginHandler, _super);
    function LoginHandler() {
        _super.apply(this, arguments);
    }
    LoginHandler.prototype.getMessageType = function () {
        return 0 /* Login */;
    };
    LoginHandler.prototype.handleAck = function (message, sender, callback) {
        var _this = this;
        if (this.isDataValid(message)) {
            if (message['guest']) {
                var connectedAccount = new Account('Guest-' + this.getRandomInt(0, 10000000), sender);
                connectedAccount.markAsGuest();
                this.server.addConnectedAccount(connectedAccount, sender);
                console.log(("Guest logged in successfully " + connectedAccount.username).green);
                sender.setData(0 /* Account */, connectedAccount);
                console.log("Guest login functionality is not finished (selects first GS)");
                return this.getWorldsSelection();
            }
            var username = message['username'];
            Models.Account.findOne({ 'username': username }, function (err, account) {
                if (err) {
                    callback(_this.generateErrorResponse("Couldn't find a user"));
                    return console.log("Couldn't find a user");
                }
                if (!account) {
                    callback(_this.generateErrorResponse("Bad login credentials"));
                    return console.log("User not found".red);
                }
                if (account.password === message['password']) {
                    if (!_this.server.isAccountConnected(username)) {
                        var connectedAccount = new Account(username, sender);
                        _this.server.addConnectedAccount(connectedAccount, sender);
                        console.log(("User logged in successfully " + account.password + " = " + message['password']).green);
                        sender.setData(0 /* Account */, connectedAccount);
                        callback(_this.getWorldsSelection());
                    }
                    else {
                        callback(_this.generateErrorResponse("User is allready connected"));
                        console.log("Account is allready connected".red);
                        return true;
                    }
                }
                else {
                    callback(_this.generateErrorResponse("Bad login credentials"));
                    console.log("User credentials are wrong".red);
                }
            });
        }
        return false;
    };
    LoginHandler.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    LoginHandler.prototype.getWorldsSelection = function () {
        return _.map(this.server.getGameServers(), function (serverLink) {
            return {
                'name': serverLink.name
            };
        });
    };
    LoginHandler.prototype.isDataValid = function (message) {
        return true;
    };
    return LoginHandler;
})(ClientMessageHandler);
module.exports = LoginHandler;
//# sourceMappingURL=LoginHandler.js.map