var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ClientMessageHandler = require('../interfaces/ClientMessageHandler');
var MessageCode = require('../../common/MessageCode');
var Models = require('../../database/Models');
var RegisterHandler = (function (_super) {
    __extends(RegisterHandler, _super);
    function RegisterHandler() {
        _super.apply(this, arguments);
    }
    RegisterHandler.prototype.getMessageType = function () {
        return 1 /* Register */;
    };
    RegisterHandler.prototype.handle = function (message, sender) {
        if (this.isDataValid(message)) {
            var account = new Models.Account({
                'username': message['username'],
                'password': message['password'],
                'salt': 'Druskike',
                'email': message['email']
            });
            account.save(function (err, accout) {
                if (err) {
                    return console.log("Username or email already exists");
                }
                console.log("User created successfully");
            });
        }
        return true;
    };
    RegisterHandler.prototype.isDataValid = function (message) {
        return true;
    };
    return RegisterHandler;
})(ClientMessageHandler);
module.exports = RegisterHandler;
//# sourceMappingURL=RegisterHandler.js.map