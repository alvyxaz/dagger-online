var mongoose = require('mongoose');
var DatabaseConnection = (function () {
    function DatabaseConnection() {
    }
    DatabaseConnection.prototype.connect = function (dbAddress, successCallback) {
        var db = mongoose.connect(dbAddress).connection;
        db.once('open', successCallback);
        db.on('error', console.error.bind(console, 'connection error:'));
    };
    return DatabaseConnection;
})();
module.exports = DatabaseConnection;
//# sourceMappingURL=DatabaseConnection.js.map