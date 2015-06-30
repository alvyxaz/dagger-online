var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var World = require('../src/gameServer/models/World');
var User = require('../src/gameServer/models/User');
var Player = require('../src/gameServer/models/Player');
describe('World', function () {
    it('Should update tick', function () {
        var world = new World();
        var ticksToDo = 5;
        var startingTick = world.tick;
        for (var i = 0; i < ticksToDo; i++) {
            world.updateTick();
        }
        world.tick.should.equal(ticksToDo + startingTick);
    });
    it('Should add and remove Player', function () {
        var world = new World();
        var user = new User(0, 'Dummy');
        var player = new Player(0, user);
        world.addPlayer(player);
        world.containsPlayer(player).should.equal(true);
        world.removePlayer(player);
        world.containsPlayer(player).should.equal(false);
    });
});
//# sourceMappingURL=worldTests.js.map