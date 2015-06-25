var chai = require('chai');
var _ = require('lodash');
var should = chai.should();
var expect = chai.expect;
var Zone = require('../src/gameServer/models/Zone');
var Player = require('../src/gameServer/models/Player');
var User = require('../src/gameServer/models/User');
var Position = require('../src/gameServer/models/Position');
var ZoneType = require('../src/gameServer/enums/ZoneType');
var GameObject = require('../src/gameServer/models/GameObject');
var zoneTemplate = {
    'name': 'Pavadinimas',
    'maxPlayers': 5,
    'type': 0 /* World */,
};
describe('Zone', function () {
    console.log(zoneTemplate);
    it('Should initialize from template', function () {
        var zone = new Zone(zoneTemplate);
        zone.name.should.equal(zoneTemplate.name);
        zone.type.should.equal(zoneTemplate.type);
    });
    describe('As entity manager', function () {
        var template = _.clone(zoneTemplate);
        template.maxPlayers = 2;
        var zone = new Zone(template);
        var position = new Position(5, 5);
        var user = new User(0, 'TestUser');
        var player = new Player(0, user);
        it('Should add a player', function () {
            zone.addPlayer(player, position).should.be.true;
            zone.containsPlayer(player).should.be.true;
            zone.containsObject(player).should.be.true;
        });
        it('Should return false when player is already added', function () {
            var player = new Player(1, user);
            zone.addPlayer(player, position).should.be.true;
        });
        it('Should not add more players than maximum', function () {
            var max = template.maxPlayers;
            var newZone = new Zone(template);
            for (var i = 0; i < max; i++) {
                var player = new Player(2, user);
                newZone.addPlayer(player, position).should.be.true;
            }
            var otherPlayer = new Player(3, user);
            newZone.addPlayer(otherPlayer, position).should.be.false;
            newZone.containsPlayer(otherPlayer).should.be.false;
        });
        it('Should add and remove objects', function () {
            var gameObject = new GameObject(1);
            zone.addObject(gameObject, position);
            zone.containsObject(gameObject).should.be.true;
            gameObject.zone.should.equal(zone);
            zone.removeObject(gameObject);
            should.not.exist(gameObject.zone);
            zone.containsObject(gameObject).should.be.false;
        });
    });
    describe('Entities', function () {
        var template = _.clone(zoneTemplate);
        var visibleRange = 30;
        var forgetRange = 60;
        template['area'] = {
            'visibleRange': visibleRange,
            'forgetRange': forgetRange
        };
        var zone = new Zone(template);
        var user = new User(0, 'TestUser');
        var playerA = new Player(0, user);
        var playerB = new Player(1, user);
        it('Should see nearby objects', function () {
            var position = new Position(0, 0);
            zone.addPlayer(playerA, position);
            playerA.knownObjects.contains(playerB).should.be.false;
            playerB.knownObjects.contains(playerA).should.be.false;
            zone.addPlayer(playerB, position);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
        });
        it('Should see objects moving within visible range', function () {
            zone.setObjectPosition(playerA, 10, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
            zone.setObjectPosition(playerA, 20, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
            zone.setObjectPosition(playerA, forgetRange - 1, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
        });
        it('Should forget entities that move outside the forget range', function () {
            zone.setObjectPosition(playerA, 0, 0);
            zone.setObjectPosition(playerB, 0, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
            zone.setObjectPosition(playerA, forgetRange + 1, 0);
            playerA.knownObjects.contains(playerB).should.be.false;
            playerB.knownObjects.contains(playerA).should.be.false;
        });
        it('Should forget removed objects', function () {
            zone.setObjectPosition(playerA, 0, 0);
            zone.setObjectPosition(playerB, 0, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
            zone.removePlayer(playerB);
            playerA.knownObjects.contains(playerB).should.be.false;
        });
    });
});
//# sourceMappingURL=zoneTests.js.map