/// <reference path='./types' />

var colors = require('colors');

import GatewayServer = require('./gatewayServer/GatewayServer');
import ConnectorServer = require('./connectorServer/ConnectorServer');
import GameServer = require('./gameServer/GameServer');

var config = require('../config.js');

var servers = config.servers;

/*
Starting gateway servers
 */
servers['gatewayServers'].forEach((serverData : any) => {
    var server = new GatewayServer("Gateway", serverData['connectorPort']);
    server.connectToDatabase(serverData['databaseAddress']);
    server.start(serverData);
});

servers['gameServers'].forEach((serverData : any) => {
    var server = new GameServer(serverData.name, serverData.port);
    server.connectToDatabase(serverData['databaseAddress']);
    server.start(serverData);
});

servers['connectors'].forEach((serverData : any) => {
    var server = new ConnectorServer(serverData.name, serverData.port);
    server.start(serverData);
});