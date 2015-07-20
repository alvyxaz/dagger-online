/**
 * Created by Alvys on 2015-06-22.
 */

import ZoneType = require('../enums/ZoneType');
import Spawn = require('../modules/Spawn');

interface ZoneTemplate {
    name: string;
    templateId: string;
    maxPlayers : number;
    type: ZoneType;
    scene: string;
    area? : {
        visibleRange : number;
        forgetRange: number;
    };
    positions: [{
        'name' : string;
        'position' : Array<Number>;
    }];
    data: {
        staticImages? : Array<Object>;
        spawns? : Array<Spawn.SpawnData>;
    };
}

export = ZoneTemplate;