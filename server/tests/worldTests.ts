/// <reference path='../src/types' />
import chai = require('chai');
var should = chai.should();
var expect = chai.expect;

import World = require('../src/gameServer/models/World');
import GameObject =  require('../src/gameServer/models/GameObject');
import User =  require('../src/gameServer/models/User');
import Player =  require('../src/gameServer/models/Player');

describe('World', () => {
    it('Should update tick', () => {
        var world = new World();
        var ticksToDo = 5;
        var startingTick = world.tick;

        for (var i = 0; i < ticksToDo; i++) {
            world.updateTick();
        }

        world.tick.should.equal(ticksToDo + startingTick);
    })

    it('Should add and remove Player', () => {
        var world = new World();
        var user = new User(0, 'Dummy');
        var player = new Player(user);

        world.addPlayer(player);
        world.containsPlayer(player).should.equal(true);
        world.removePlayer(player);
        world.containsPlayer(player).should.equal(false);
    })
});
