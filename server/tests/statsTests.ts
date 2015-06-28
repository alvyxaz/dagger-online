/// <reference path='../src/types' />
import chai = require('chai');
var should = chai.should();
var expect = chai.expect;

import stats = require('../src/gameServer/modules/Stats');
var Stat = stats.Stat;
var StatType = stats.StatType;
var StatHolder = stats.StatHolder;
var StatModifierType = stats.StatModifierType;

describe ('Stats Holder', () => {

    it('Should have initial stats', () => {
        var baseStrength = 10;
        var stats : Array<stats.Stat> = [
            new Stat(StatType.Strength, baseStrength, {})
        ];
        var statHolder = new StatHolder(stats);
        statHolder.calculateStat(StatType.Strength).should.be.greaterThan(0);
        statHolder.calculateStat(StatType.Constitution).should.be.equal(0);
    });

    it('Should change derived stats if it\'s dependencies change', () => {
        var statHolder = new StatHolder(StatHolder.generateStats());
        var maxHealth = statHolder.calculateStat(StatType.MaxHealth);
        var constitution : stats.Stat = statHolder.getStat(StatType.Constitution);
        constitution.baseValue = constitution.baseValue+1;
        maxHealth.should.be.lessThan(statHolder.calculateStat(StatType.MaxHealth));
    });

    it('Should support modifiers', () => {
        var baseStrength = 5;
        var stats : Array<stats.Stat> = [
            new Stat(StatType.Strength, baseStrength)
        ];
        var statHolder = new StatHolder(stats);

        // Modifiers
        var addBase = { statType: StatType.Strength, type: StatModifierType.AddBase, value: 5};
        var multiplyBase = { statType: StatType.Strength, type: StatModifierType.MultiplyBase, value: 2};
        var add = { statType: StatType.Strength, type: StatModifierType.Add, value: 10};
        var multiply = { statType: StatType.Strength, type: StatModifierType.Multiply, value: 0.5};
        var addBase2 = { statType: StatType.Strength, type: StatModifierType.AddBase, value: 15};
        var multiplyBase2 = { statType: StatType.Strength, type: StatModifierType.MultiplyBase, value: 2};


        // Add multiplier
        statHolder.addModifier(addBase);
        statHolder.calculateStat(StatType.Strength).should.be.equal(baseStrength + 5);
        statHolder.addModifier(addBase); // Should not add the same multiplier
        statHolder.calculateStat(StatType.Strength).should.be.equal(baseStrength + 5);
        statHolder.addModifier(multiplyBase);
        statHolder.calculateStat(StatType.Strength).should.be.equal((baseStrength + 5) * 2);
        statHolder.addModifier(add);
        statHolder.calculateStat(StatType.Strength).should.be.equal(((baseStrength + 5) * 2) + 10);
        statHolder.addModifier(multiply);
        statHolder.calculateStat(StatType.Strength).should.be.equal((((baseStrength + 5) * 2) + 10) * 0.5);

        // Check if ordering is right
        statHolder.addModifier(addBase2);
        statHolder.calculateStat(StatType.Strength).should.be.equal((((baseStrength + 5 + 15) * 2) + 10) * 0.5);
        statHolder.addModifier(multiplyBase2);
        statHolder.calculateStat(StatType.Strength).should.be.equal((((baseStrength + 5 + 15) * 2 * 2) + 10) * 0.5);

    });

    it('Should support stat options', () => {
        var options = {
            minValue: 5,
            maxValue: 10,
        }

        var stats : Array<stats.Stat> = [
            new Stat(StatType.Mentality, 20.5, {isFloat: true}),
            new Stat(StatType.Strength, -1, options),
            new Stat(StatType.Intelligence, 100, options),
            new Stat(StatType.Dexterity, 10.5),
            new Stat(StatType.Constitution, 20.5, {isFloat: true}),
        ];
        var statHolder = new StatHolder(stats);

        statHolder.calculateStat(StatType.Strength).should.equal(options.minValue);
        statHolder.calculateStat(StatType.Intelligence).should.equal(options.maxValue);
        statHolder.calculateStat(StatType.Dexterity).should.equal(10);
        statHolder.calculateStat(StatType.Constitution).should.equal(20.5);

    });

})

describe('Stat Holder', () => {

});