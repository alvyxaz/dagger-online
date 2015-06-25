/**
 * Created by Alvys on 2015-05-29.
 */
import SubServerMessage = require('../../serverCommon/messages/subServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');
import ConnectorServer = require('../../connectorServer/ConnectorServer');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');

class RegisterConnectorMessage extends SubServerMessage {
    constructor(connectorServer: ConnectorServer) {
        super(SubServerMessageCode.RegisterConnector);

        var data = {};
        data[SubServerParameterCode.MaxConnections] = connectorServer.maxConnections;
        data[SubServerParameterCode.GameServerInfo] = connectorServer.gameServerInfo;
        data[SubServerParameterCode.PublicAddress] = connectorServer.publicAddress;
        super.setData(data);
    }
}

export = RegisterConnectorMessage;
