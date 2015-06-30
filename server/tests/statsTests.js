var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var stats = require('../src/gameServer/modules/Stats');
var Stat = stats.Stat;
var StatType = stats.StatType;
var StatHolder = stats.StatHolder;
var StatModifierType = stats.StatModifierType;
describe('Stats Holder', function () {
    it('Should have initial stats', function () {
        var baseStrength = 10;
        var stats = [
            new Stat(1 /* Strength */, baseStrength, {})
        ];
        var statHolder = new StatHolder(stats);
        statHolder.calculateStat(1 /* Strength */).should.be.greaterThan(0);
        statHolder.calculateStat(3 /* Constitution */).should.be.equal(0);
    });
    it('Should change derived stats if it\'s dependencies change', function () {
        var statHolder = new StatHolder(StatHolder.generateStats());
        var maxHealth = statHolder.calculateStat(8 /* MaxHealth */);
        var constitution = statHolder.getStat(3 /* Constitution */);
        constitution.baseValue = constitution.baseValue + 1;
        maxHealth.should.be.lessThan(statHolder.calculateStat(8 /* MaxHealth */));
    });
    it('Should support modifiers', function () {
        var baseStrength = 5;
        var stats = [
            new Stat(1 /* Strength */, baseStrength)
        ];
        var statHolder = new StatHolder(stats);
        var addBase = { statType: 1 /* Strength */, type: 0 /* AddBase */, value: 5 };
        var multiplyBase = { statType: 1 /* Strength */, type: 1 /* MultiplyBase */, value: 2 };
        var add = { statType: 1 /* Strength */, type: 2 /* Add */, value: 10 };
        var multiply = { statType: 1 /* Strength */, type: 3 /* Multiply */, value: 0.5 };
        var addBase2 = { statType: 1 /* Strength */, type: 0 /* AddBase */, value: 15 };
        var multiplyBase2 = { statType: 1 /* Strength */, type: 1 /* MultiplyBase */, value: 2 };
        statHolder.addModifier(addBase);
        statHolder.calculateStat(1 /* Strength */).should.be.equal(baseStrength + 5);
        statHolder.addModifier(addBase);
        statHolder.calculateStat(1 /* Strength */).should.be.equal(baseStrength + 5);
        statHolder.addModifier(multiplyBase);
        statHolder.calculateStat(1 /* Strength */).should.be.equal((baseStrength + 5) * 2);
        statHolder.addModifier(add);
        statHolder.calculateStat(1 /* Strength */).should.be.equal(((baseStrength + 5) * 2) + 10);
        statHolder.addModifier(multiply);
        statHolder.calculateStat(1 /* Strength */).should.be.equal((((baseStrength + 5) * 2) + 10) * 0.5);
        statHolder.addModifier(addBase2);
        statHolder.calculateStat(1 /* Strength */).should.be.equal((((baseStrength + 5 + 15) * 2) + 10) * 0.5);
        statHolder.addModifier(multiplyBase2);
        statHolder.calculateStat(1 /* Strength */).should.be.equal((((baseStrength + 5 + 15) * 2 * 2) + 10) * 0.5);
    });
    it('Should support stat options', function () {
        var options = {
            minValue: 5,
            maxValue: 10,
        };
        var stats = [
            new Stat(5 /* Mentality */, 20.5, { isFloat: true }),
            new Stat(1 /* Strength */, -1, options),
            new Stat(4 /* Intelligence */, 100, options),
            new Stat(2 /* Dexterity */, 10.5),
            new Stat(3 /* Constitution */, 20.5, { isFloat: true }),
        ];
        var statHolder = new StatHolder(stats);
        statHolder.calculateStat(1 /* Strength */).should.equal(options.minValue);
        statHolder.calculateStat(4 /* Intelligence */).should.equal(options.maxValue);
        statHolder.calculateStat(2 /* Dexterity */).should.equal(10);
        statHolder.calculateStat(3 /* Constitution */).should.equal(20.5);
    });
});
describe('Stat Holder', function () {
});
//# sourceMappingURL=statsTests.js.map