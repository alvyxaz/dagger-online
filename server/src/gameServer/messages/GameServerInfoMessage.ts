/**
 * Created by Alvys on 2015-05-29.
 */
import SubServerMessage = require('../../serverCommon/messages/subServerMessage');
import SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');
import GameServer = require('../GameServer');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');

class GameServerInfoMessage extends SubServerMessage {
    constructor(gameServer: GameServer) {
        super(SubServerMessageCode.GameServerInfo);
        var data = {};
        data[SubServerParameterCode.GameServerInfo] = {
            'name' : gameServer.name
        };
        super.setData(data);
    }
}

export = GameServerInfoMessage;
