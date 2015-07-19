var chai = require('chai');
var _ = require('lodash');
var should = chai.should();
var expect = chai.expect;
var MessageCode = require('../src/common/MessageCode');
var Zone = require('../src/gameServer/models/Zone');
var Player = require('../src/gameServer/models/Player');
var User = require('../src/gameServer/models/User');
var Position = require('../src/gameServer/models/Position');
var ZoneType = require('../src/gameServer/enums/ZoneType');
var GameObject = require('../src/gameServer/models/GameObject');
var Character = require('../src/gameServer/models/Character');
var zoneTemplate = {
    'name': 'Pavadinimas',
    'templateId': 'pavadinimas',
    'maxPlayers': 5,
    'type': 0 /* World */,
    'data': {},
    'scene': 'world',
    'positions': [
        { 'name': 'start', 'position': [1, 2, 3] }
    ],
    area: {
        visibleRange: 3,
        forgetRange: 5
    }
};
describe('Zone', function () {
    it('Should initialize from template', function () {
        var zone = new Zone(zoneTemplate);
        zone.name.should.equal(zoneTemplate.name);
        zone.type.should.equal(zoneTemplate.type);
    });
    it('Should initialize from world template', function () {
        var mapData = require('../data/maps/world.json');
        var zone = new Zone(mapData);
        zone.name.should.equal(mapData['name']);
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
        it('Should retrieve a position in zone', function () {
            should.exist(zone.getPosition('start'));
            should.not.exist(zone.getPosition('randomNonExistingPosition'));
        });
    });
    describe('Player', function () {
        var visibleRange = 10;
        var forgetRange = 20;
        var template = _.clone(zoneTemplate);
        template['area'] = {
            'visibleRange': visibleRange,
            'forgetRange': forgetRange
        };
        var zone = new Zone(template);
        var user = new User(0, 'alvys');
        var player = new Player(0, user);
        var sendMessage = generateSendMessageMock();
        var messages = sendMessage['messages'];
        player.sendMessage = sendMessage['callback'];
        var gameObject = new GameObject(1);
        gameObject.name = "Object1";
        var gameCharacter = new Character(2);
        gameCharacter.name = "Object2";
        var userB = new User(1, "Object3");
        var playerB = new Player(3, userB);
        zone.addObject(gameObject, new Position(0, 0));
        zone.addObject(gameCharacter, new Position(30, 1));
        zone.addPlayer(playerB, new Position(1, 1));
        zone.addPlayer(player, new Position(2, 2));
        it('Should get a list of visible object when it enters', function () {
            var objectsMessage = _.find(messages, function (message) {
                return message['code'] === 11 /* ShowObjects */;
            });
            should.exist(objectsMessage);
            var objects = objectsMessage['data'];
            should.exist(_.find(objects, function (o) {
                return o['name'] === 'Object1';
            }));
            should.exist(_.find(objects, function (o) {
                return o['name'] === 'Object3';
            }));
            should.not.exist(_.find(objects, function (o) {
                return o['name'] === 'Object2';
            }));
        });
        it('Should get a visible object that just came into range', function () {
            messages.length = 0;
            zone.setObjectPosition(gameCharacter, 0, 0);
            var objectsMessage = _.find(messages, function (message) {
                return message['code'] === 11 /* ShowObjects */;
            });
            var objects = objectsMessage['data'];
            should.not.exist(_.find(objects, function (o) {
                return o['name'] === 'Object1';
            }));
            should.not.exist(_.find(objects, function (o) {
                return o['name'] === 'Object3';
            }));
            should.exist(_.find(objects, function (o) {
                return o['name'] === 'Object2';
            }));
        });
        it("Should remove a visible object when it's out of range", function () {
            messages.length = 0;
            zone.setObjectPosition(gameObject, 0, 50);
            var objectsMessage = _.find(messages, function (message) {
                return message['code'] === 12 /* RemoveObjects */;
            });
            var objects = objectsMessage['data'];
            should.exist(_.find(objects, function (o) {
                return o === gameObject.id;
            }));
            should.not.exist(_.find(objects, function (o) {
                return o === gameCharacter.id;
            }));
            should.not.exist(_.find(objects, function (o) {
                return o === playerB.id;
            }));
        });
    });
});
function generateSendMessageMock() {
    var messages = [];
    return {
        'messages': messages,
        'callback': function (code, message) {
            messages.push({
                'code': code,
                'data': message
            });
        }
    };
}
//# sourceMappingURL=zoneTests.js.map