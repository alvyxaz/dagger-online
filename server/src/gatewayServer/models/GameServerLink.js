var collections = require('../../collections');
var _ = require('lodash');
var GameServerLink = (function () {
    function GameServerLink(name) {
        this.connectors = new collections.Dictionary();
        this.name = name;
    }
    GameServerLink.prototype.addConnector = function (connector) {
        connector.setGameServerLink(this);
        if (!this.connectors.containsKey(connector.getId())) {
            this.connectors.setValue(connector.getId(), connector);
            console.log((this.name + '(GameServerLink): Added connector with id: ' + connector.getId()).cyan);
        }
        else {
            console.log('Connector you\'re trying to add is already added'.red);
        }
    };
    GameServerLink.prototype.removeConnector = function (connector) {
        this.connectors.remove(connector.getId());
    };
    GameServerLink.prototype.getAvailableConnector = function () {
        return _.find(this.connectors.values(), function (connector) {
            return !connector.isFull();
        });
    };
    return GameServerLink;
})();
module.exports = GameServerLink;
//# sourceMappingURL=GameServerLink.js.map