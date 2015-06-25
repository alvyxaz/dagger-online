/**
 * Created by Alvys on 2015-05-30.
 */
/// <reference path='../../types' />

import GatewayServer = require('../GatewayServer');
import GameServerLink = require('./GameServerLink')
import Sockets = require('../../core/connections/Sockets');
import SocketData = require('../../serverCommon/SocketData');
import SubServerParameterCode = require('../../serverCommon/SubServerParameterCode');
import SubServerMessageCode = require('../../serverCommon/messages/subServerMessageCode');

class AvailableConnector {
    private socket: Sockets.Socket;
    private server: GatewayServer;

    public gameServerName : string;
    private gameServerLink : GameServerLink;

    public maxConnections : number;
    public publicAddress : string;

    private connectedCount : number;

    constructor(server: GatewayServer, socket: Sockets.Socket, message : Object) {
        this.connectedCount = 0;
        this.socket = socket;
        this.server = server;

        this.maxConnections = message[SubServerParameterCode.MaxConnections];
        this.publicAddress = message[SubServerParameterCode.PublicAddress];
        var gameServerInfo = message[SubServerParameterCode.GameServerInfo];

        // Setup game server info
        this.gameServerName = gameServerInfo['name'];

        socket.setData(SocketData.Connector, this);

        socket.onDisconnect(() => {
            server.removeConnector(this);
            if (this.gameServerLink) {
                this.gameServerLink.removeConnector(this);
            }
        })
    }

    public sendMessage(code : SubServerMessageCode, data : Object, callback? : (data: Object) => void) {
        this.socket.sendMessage(code, data, callback);
    }

    public setGameServerLink(gameServer : GameServerLink) : void {
        this.gameServerLink = gameServer;
    }

    public removeGameServerLink(gameServer: GameServerLink) : void {
        if (this.gameServerLink === gameServer) {
            this.gameServerLink = undefined;
        }
    }

    public isFull() : boolean {
        return (this.maxConnections < this.connectedCount);
    }

    public getId() : string {
        return this.socket.getSid();
    }
}

export = AvailableConnector;