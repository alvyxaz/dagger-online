var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var _ = require('lodash');
var World = require('../src/gameServer/models/World');
var Zone = require('../src/gameServer/models/Zone');
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
        should.not.exist(user.currentPlayer);
        world.containsPlayer(player).should.equal(false);
        world.addPlayer(player);
        world.containsPlayer(player).should.equal(true);
        user.currentPlayer.should.equal(player);
        world.removePlayer(player);
        world.containsPlayer(player).should.equal(false);
        should.not.exist(user.currentPlayer);
    });
    it('Should generate unique instance ids', function () {
        var world = new World();
        var idList = new Array();
        for (var i = 0; i < 100; i++) {
            var newId = world.generateInstanceId();
            _.include(idList, newId).should.be.false;
            idList.push(newId);
        }
    });
    it('Should get zone by name', function () {
        var zoneTemplate = _.cloneDeep(require('../data/maps/world.json'));
        zoneTemplate.name = "SuperUnexistingName";
        var zone = new Zone(zoneTemplate);
        var world = new World();
        world.addZone(zone);
        should.exist(world.getZoneByName("SuperUnexistingName"));
    });
});
//# sourceMappingURL=worldTests.js.map