import Position = require('./Position');
import Zone = require('./Zone');
import Player = require('./Player');
import KnownObjectsList = require('./KnownObjectsList');
import GameObjectType = require('../enums/GameObjectType');

import MessageCode = require('../../common/MessageCode');

import Spawn = require('../modules/Spawn');
import ObjectTemplate = require('../templates/ObjectTemplate');

class GameObject implements Spawn.Spawnable {
    private _position : Position;
    private _zone : Zone;
    private _instanceId : number;
    private _knownObjects : KnownObjectsList;

    public name: string;

    constructor(id: number, template? : ObjectTemplate) {
        this._instanceId = id;
        this._knownObjects = new KnownObjectsList(this);
        this.name = "Unnamed";

        if (template) {
            this.name = template.name;
        }
    }

    get prefab() : string {return 'Unknown';}
    get id() : number {return this._instanceId;}
    get type() : GameObjectType {return GameObjectType.Any;}

    get position() : Position {return this._position;}
    set position(position: Position)  {
        if (this._zone) {
            this._zone.setObjectPosition(this, position.x, position.y);
        }
    }

    get knownObjects() : KnownObjectsList {return this._knownObjects;}

    public setPosition(x : number, y: number) {
        this._position.x = x;
        this._position.y = y;
    }

    get zone() : Zone {return this._zone;}
    public setZone(zone: Zone, position: Position) {
        this._zone = zone;
        this._position = position;
    }

    public onRemovedFromZone() {
        this._zone = null;
        this._position = null;
    }

    public toJSON(): Object {
        return {
            'name' : this.name,
            'id' : this.id,
            'position' : this._position.toArray(),
            'prefab' : this.prefab
        }
    }

    public broadcastPacket(code: MessageCode, packet: Object, includeSelf?: boolean) {
        var players = this._knownObjects.getPlayers();
        if (includeSelf && this.type === GameObjectType.Player) {
            players.push(<Player>this);
        }
        players.forEach((player: Player) => {
            player.user.sendMessage(code, packet);
        });
    }

    public trySendMessage(code: MessageCode, packet: Object) {
        // Does nothing for all except players
    }

    addRemoveListener(listener: (obj: GameObject) => void): void {

    }
}

export = GameObject;