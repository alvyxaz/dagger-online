var mongoose = require('mongoose');
var Schemas = require('./Schemas');
var Models = (function () {
    function Models() {
        this.Account = mongoose.model('Account', Schemas.accountSchema);
    }
    return Models;
})();
var models = new Models();
module.exports = models;
//# sourceMappingURL=Models.js.map