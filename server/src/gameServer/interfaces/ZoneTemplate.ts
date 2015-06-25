/**
 * Created by Alvys on 2015-06-22.
 */

import ZoneType = require('../enums/ZoneType');

interface ZoneTemplate {
    name: string;
    maxPlayers : number;
    type: ZoneType;
    area? : {
        visibleRange : number;
        forgetRange: number;
    };
}

export = ZoneTemplate;