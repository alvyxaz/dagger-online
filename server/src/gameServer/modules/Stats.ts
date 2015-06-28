/**
 * Created by Alvys on 2015-06-25.
 */
/// <reference path='../../types' />
import _ = require('lodash');

export enum StatType {
    // General
    Level,

    // Attributes
    Strength,
    Dexterity,
    Constitution,
    Intelligence,
    Mentality,

    // Derived,
    Attack,
    Armor,
    MaxHealth
}

interface StatOptions {
    isFloat? : boolean;
    minValue? : number;
    maxValue? : number;
}

export interface StatModifier {
    statType: StatType;
    type: StatModifierType;
    value: number;
}

/**
 * Also represents an order in which stats are applied
 */
export enum StatModifierType {
    AddBase,
    MultiplyBase,
    Add,
    Multiply
}

var defaultStatOptions : StatOptions = {
    isFloat: false,
    minValue: Number.MIN_VALUE,
    maxValue: Number.MAX_VALUE
}

var statFunctions = {
    attack: (stat: Stat, allStats: StatHolder) => {
        return stat.baseValue + allStats.calculateStat(StatType.Strength * 2);
    },
    armor: (stat: Stat, allStats: StatHolder) => {
        return stat.baseValue
            + allStats.calculateStat(StatType.Strength)
            + allStats.calculateStat(StatType.Dexterity);
    },
    maxHealth: (stat: Stat, allStats: StatHolder) => {
        return stat.baseValue
            + allStats.calculateStat(StatType.Constitution) * 5
            + allStats.calculateStat(StatType.Level) * 5;
    }
};

/**
 * Represents a stat holder, which is responsible for managing, calculating
 * stats and stat modifiers
 */
export class StatHolder {
    private _stats: {} = {};
    private _modifiers: {} = {};

    public constructor(stats : Array<Stat>) {
        stats.forEach((stat) => {
            this.addStat(stat);
        });
    }

    public getStat(statType : StatType): Stat {
        return this._stats[statType];
    }

    private addStat(stat : Stat) {
        this._stats[stat.type] = stat;
        this._modifiers[stat.type] = [];
    }

    public addModifier(modifier: StatModifier) {
        var statModifiers = this._modifiers[modifier.statType];
        if (!statModifiers) {
            // No modifier was ever added to this stat
            statModifiers = [];
            this._modifiers[modifier.statType] = statModifiers;
        }

        if (!_.include(statModifiers, modifier)) {
            // If modifier is not already added
            statModifiers.push(modifier);
            this._modifiers[modifier.statType] = _.sortBy(statModifiers, 'type');
        }
    }

    public removeModifier(modifier: StatModifier) {
        var statModifiers = this._modifiers[modifier.statType];
        if (!statModifiers) {
            _.remove(statModifiers, function (tempModifier) {
                return tempModifier === modifier;
            })
        }
    }

    public calculateStat(statType: StatType) : number {
        var stat: Stat = this._stats[statType];
        if (!stat) {
            // couldn't add such stat, just return 0
            return 0;
        }
        var value = stat.getValue(this);
        var modifiers = this._modifiers[statType];
        modifiers.forEach(function (modifier: StatModifier) {
            if (modifier.type === StatModifierType.Multiply || modifier.type === StatModifierType.MultiplyBase) {
                // Multiply modifier
                value *= modifier.value;
            } else {
                // Add modifier
                value += modifier.value;
            }
        });

        return this.applyOptions(value, stat.options);
    }

    private applyOptions (value: number, options: StatOptions): number {
        if (options.minValue && options.minValue > value) {
            value = options.minValue;
        }
        if (options.maxValue && options.maxValue < value) {
            value = options.maxValue;
        }
        if (!options.isFloat) {
            value = Math.floor(value);
        }
        return value;
    }

    public static generateStats(): Array<Stat> {
        var stats: Array<Stat> = [];

        // General
        stats.push(new Stat(StatType.Level, 1, { maxValue: 50 }));

        // Attributes
        stats.push(new Stat(StatType.Strength, 1));
        stats.push(new Stat(StatType.Dexterity, 1));
        stats.push(new Stat(StatType.Constitution, 1));
        stats.push(new Stat(StatType.Intelligence, 1));
        stats.push(new Stat(StatType.Mentality, 1));

        // Derived
        stats.push(new Stat(StatType.Armor, 1, {}, statFunctions.armor));
        stats.push(new Stat(StatType.MaxHealth, 10, {}, statFunctions.maxHealth));

        return stats;
    }
}

/**
 * Represents a stat (attribute) such as strength, intelligence and etc.
 * Calculator allows creating both, base stats and derived stats
 */
export class Stat {
    private _type: StatType;
    private _baseValue : number = 0;
    private _calculator: (stat: Stat, allStats: StatHolder) => number
    private _options: StatOptions;

    constructor (statType: StatType, baseValue: number, options?: StatOptions,
                 calculator?: (stat: Stat, allStats: StatHolder) => number) {
        this._baseValue = baseValue;
        this._calculator = calculator;
        this._type = statType;
        this._options = options ? _.merge(_.clone(defaultStatOptions), options): _.clone(defaultStatOptions);
    }

    get baseValue() : number {return this._baseValue;}
    set baseValue(value: number) {this._baseValue = value;}

    get options() : StatOptions {return this._options;}
    get type() : StatType {return this._type; }

    getValue(stats: StatHolder) : number {
        if (this._calculator) {
            return (this._calculator(this, stats));
        }
        return this.baseValue;
    }
}
