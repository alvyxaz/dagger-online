/**
 * Created by Alvys on 2015-05-27.
 */
module.exports = {
    'servers' : {
        /*
         Gateway server
         */
        'gatewayServers' : [{
            'port' : 2999,
            'connectorPort' : 3000,
            'databaseAddress' : 'mongodb://localhost/dagger'
        }],

        /*
         Game server
         */
        'gameServers' : [
            {
                'name' : 'Europe',
                'port' : 3001
            }
        ],

        /*
         Connector servers
         */
        'connectors' : [
            {
                'name' : 'con1',
                'port' : 3002,
                'maxConnections' : 1000,
                'publicAddress' : 'ws://127.0.0.1:3002',
                'gatewayAddress' : 'http://127.0.0.1:3000',
                'gameServerAddress' : 'http://127.0.0.1:3001'
            },
            {
                'name' : 'con2',
                'port' : 3003,
                'maxConnections' : 1000,
                'publicAddress' : 'ws://127.0.0.1:3003',
                'gatewayAddress' : 'http://127.0.0.1:3000',
                'gameServerAddress' : 'http://127.0.0.1:3001'
            }
        ]
    }
}