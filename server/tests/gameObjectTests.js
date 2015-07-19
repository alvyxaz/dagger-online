var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var Player = require('../src/gameServer/models/Player');
var GameObject = require('../src/gameServer/models/GameObject');
var Character = require('../src/gameServer/models/Character');
var User = require('../src/gameServer/models/User');
describe('Game Object', function () {
    describe('Known List', function () {
        it('Should automatically update visible list', function () {
            var user = new User(0, 'TestUser');
            var playerA = new Player(0, user);
            var playerB = new Player(1, user);
            playerA.knownObjects.addObject(playerB);
            playerB.knownObjects.contains(playerA).should.be.true;
        });
        it("Should give all visible players", function () {
            var user = new User(0, 'TestUser');
            var playerA = new Player(0, user);
            var playerB = new Player(1, user);
            var gameObject1 = new GameObject(2);
            var gameObject2 = new GameObject(3);
            var character = new Character(4);
            playerA.knownObjects.addObject(playerB);
            playerA.knownObjects.addObject(gameObject1);
            playerA.knownObjects.addObject(gameObject2);
            playerA.knownObjects.addObject(character);
            playerB.knownObjects.addObject(gameObject1);
            var players = playerA.knownObjects.getPlayers();
            players.length.should.equal(1);
            players[0].should.equal(playerB);
            var gamePlayers = gameObject1.knownObjects.getPlayers();
            gamePlayers.length.should.equal(2);
            gameObject1.knownObjects.contains(playerA).should.be.true;
            gameObject1.knownObjects.contains(playerB).should.be.true;
        });
    });
});
//# sourceMappingURL=gameObjectTests.js.map