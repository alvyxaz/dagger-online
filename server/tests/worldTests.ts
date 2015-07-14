/// <reference path='../src/types' />
import chai = require('chai');
var should = chai.should();
var expect = chai.expect;
import _ = require('lodash');

import World = require('../src/gameServer/models/World');
import Zone = require('../src/gameServer/models/Zone');
import GameObject =  require('../src/gameServer/models/GameObject');
import User =  require('../src/gameServer/models/User');
import Player =  require('../src/gameServer/models/Player');
import ZoneTemplate = require('../src/gameServer/interfaces/ZoneTemplate');

describe('World', () => {
    it('Should update tick', () => {
        var world = new World();
        var ticksToDo = 5;
        var startingTick = world.tick;

        for (var i = 0; i < ticksToDo; i++) {
            world.updateTick();
        }

        world.tick.should.equal(ticksToDo + startingTick);
    });

    it('Should add and remove Player', () => {
        var world = new World();
        var user = new User(0, 'Dummy');
        var player = new Player(0, user);

        // Add player
        should.not.exist(user.currentPlayer);
        world.containsPlayer(player).should.equal(false);
        world.addPlayer(player);
        world.containsPlayer(player).should.equal(true);
        user.currentPlayer.should.equal(player);

        // Remove player
        world.removePlayer(player);
        world.containsPlayer(player).should.equal(false);
        should.not.exist(user.currentPlayer);
    });

    it ('Should generate unique instance ids', () => {
        var world = new World();

        var idList = new Array<number>();

        for(var i =0; i < 100; i++) {
            var newId = world.generateInstanceId();
            _.include(idList, newId).should.be.false;
            idList.push(newId);
        }
    });

    it('Should get zone by name', () => {
        var zoneTemplate: ZoneTemplate = _.cloneDeep(require('../data/maps/world.json'));
        zoneTemplate.name = "SuperUnexistingName";
        var zone = new Zone(zoneTemplate);
        var world = new World();
        world.addZone(zone);

        should.exist(world.getZoneByName("SuperUnexistingName"));
    });
});
