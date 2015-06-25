/**
 * Created by Alvys on 2015-05-31.
 */

import AvailableConnector = require('./AvailableConnector');
import collections = require('../../collections');
import _ = require('lodash');

class GameServerLink {
    public name: string;
    private connectors = new collections.Dictionary<string, AvailableConnector>()

    constructor(name : string) {
        this.name = name;
    }

    public addConnector(connector: AvailableConnector) : void {
        connector.setGameServerLink(this);
        if (!this.connectors.containsKey(connector.getId())){
            // There's no connector with this id
            this.connectors.setValue(connector.getId(), connector);
            console.log(( this.name + '(GameServerLink): Added connector with id: ' + connector.getId()).cyan);
        } else {
            console.log('Connector you\'re trying to add is already added'.red);
        }
    }

    public removeConnector(connector: AvailableConnector) : void {
        this.connectors.remove(connector.getId());
    }

    public getAvailableConnector() : AvailableConnector {
        return _.find(this.connectors.values(), (connector: AvailableConnector) => {
            return !connector.isFull();
        });
    }
}

export = GameServerLink