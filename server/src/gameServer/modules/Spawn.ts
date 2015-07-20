/**
 * Represents data, necessary for spawn to work.
 * Might be loaded from database, might be generated, etc...
 */
export interface SpawnData {
    respawnTime: number;
    x: number;
    y: number;
    width: number;
    height: number;
    count: number;
    template: string;
}

/**
 * Interface that should be implemented by anything that wants to
 * be spawned
 */
export interface Spawnable {
    addRemoveListener(listener: (obj: Spawnable) => void): void;
}

export interface SpawnListener {
    onSpawn(obj: Spawnable);
}

/**
 * Represents a spawn management module
 * @constructor
 */
export class SpawnController {
    private _data : SpawnData;
    private _listener: SpawnListener;

    constructor(data: SpawnData, listener: SpawnListener) {
        this._data;
        this._listener = listener;
    }

    public addSpawn(obj : Spawnable) : void {
        obj.addRemoveListener(this.onRemove);
    }

    private onRemove(obj : Spawnable) : void {
        this.scheduleRespawn(obj);
    }

    private scheduleRespawn(obj: Spawnable) : void {
        setTimeout(() => {
            this._listener.onSpawn(obj);
        }, this._data.respawnTime);
    }
}
