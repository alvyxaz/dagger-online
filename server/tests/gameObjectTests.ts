/// <reference path='../src/types' />
import chai = require('chai');
import _ = require('lodash');

var should = chai.should();
var expect = chai.expect;

import Player = require('../src/gameServer/models/Player');
import GameObject = require('../src/gameServer/models/GameObject');
import Character = require('../src/gameServer/models/Character');
import User = require('../src/gameServer/models/User');

describe('Game Object', () => {

    describe('Known List', () => {


        it('Should automatically update visible list', () => {
            var user = new User(0, 'TestUser');
            var playerA = new Player(0, user);
            var playerB = new Player(1, user);

            playerA.knownObjects.addObject(playerB);
            playerB.knownObjects.contains(playerA).should.be.true;
        });

        it ("Should give all visible players", () => {
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

            // What player sees
            var players = playerA.knownObjects.getPlayers();
            players.length.should.equal(1);
            players[0].should.equal(playerB);

            // What game object sees
            var gamePlayers = gameObject1.knownObjects.getPlayers();
            gamePlayers.length.should.equal(2);
            gameObject1.knownObjects.contains(playerA).should.be.true;
            gameObject1.knownObjects.contains(playerB).should.be.true;
        });
    });
});