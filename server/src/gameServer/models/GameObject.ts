import Position = require('./Position');
import Zone = require('./Zone');
import KnownObjectsList = require('./KnownObjectsList');
import GameObjectType = require('../enums/GameObjectType');

class GameObject {
    private _position : Position;
    private _zone : Zone;
    private _instanceId : number;
    private _knownObjects : KnownObjectsList;

    public name: string;

    constructor(id: number) {
        this._instanceId = id;
        this._knownObjects = new KnownObjectsList(this);
        this.name = "Unnamed";
    }

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
}

export = GameObject;