/**
 * Created by Alvys on 2015-06-22.
 */

import ZoneType = require('../enums/ZoneType');

interface ZoneTemplate {
    name: string;
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
    data: Object;
}

export = ZoneTemplate;