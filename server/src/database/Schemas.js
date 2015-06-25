var mongoose = require('mongoose');
var Schemas = (function () {
    function Schemas() {
        this.accountSchema = new mongoose.Schema({
            'username': { type: String, unique: true },
            'password': String,
            'salt': String,
            'email': { type: String, unique: true },
        }, {
            'collection': 'accounts'
        });
    }
    return Schemas;
})();
var schemas = new Schemas();
module.exports = schemas;
//# sourceMappingURL=Schemas.js.map