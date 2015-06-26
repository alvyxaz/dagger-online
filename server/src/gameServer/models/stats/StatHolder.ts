/**
 * Created by Alvys on 2015-06-25.
 */
import StatType = require('../../enums/StatType');
import GameObject = require('../GameObject');

interface StatHolderTemplate {

}

var defaultTemplate: StatHolderTemplate = {

}

class StatHolder {
    public GetStat(stat: StatType) : number {
        return 0;
    }

    public addModifier() {

    }

    public setStat(stat: StatType, value: number) {

    }

    public calculateStat(stat: StatType, target: GameObject) {

    }

    public static createStatHolder(template: StatHolderTemplate) {
        return new StatHolder();
    }
}

class Stat {
    private _baseValue : number;

    constructor (baseValue: number) {
        this._baseValue = baseValue;
    }
}

interface StatModifier {
    constructor(stat: StatType, order: number)
}