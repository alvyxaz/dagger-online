/// <reference path='../src/types' />
import chai = require('chai');
import _ = require('lodash');

var should = chai.should();
var expect = chai.expect;

import Zone = require('../src/gameServer/models/Zone');
import ZoneTemplate = require('../src/gameServer/interfaces/ZoneTemplate');
import Player = require('../src/gameServer/models/Player');
import User = require('../src/gameServer/models/User');
import Position = require('../src/gameServer/models/Position');
import ZoneType = require('../src/gameServer/enums/ZoneType');
import GameObject =  require('../src/gameServer/models/GameObject');

var zoneTemplate : ZoneTemplate = {
    'name' : 'Pavadinimas',
    'maxPlayers' : 5,
    'type' : ZoneType.World,
};

describe('Zone', () => {
    console.log(zoneTemplate);
    it('Should initialize from template', () => {
        var zone : Zone = new Zone(zoneTemplate);
        zone.name.should.equal(zoneTemplate.name);
        zone.type.should.equal(zoneTemplate.type);
    });

    describe('As entity manager', () => {
        var template = _.clone(zoneTemplate);
        template.maxPlayers = 2;
        var zone = new Zone(template);
        var position = new Position(5, 5);
        var user = new User(0, 'TestUser');
        var player = new Player(0, user);

        it('Should add a player', () => {
            zone.addPlayer(player, position).should.be.true;
            zone.containsPlayer(player).should.be.true;
            zone.containsObject(player).should.be.true;
        });

        it('Should return false when player is already added', () => {
            var player = new Player(1, user);
            zone.addPlayer(player, position).should.be.true;
        });

        it('Should not add more players than maximum', () => {
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

        it('Should add and remove objects', () => {
            var gameObject: GameObject = new GameObject(1);
            zone.addObject(gameObject, position);
            zone.containsObject(gameObject).should.be.true;
            gameObject.zone.should.equal(zone);
            zone.removeObject(gameObject);
            should.not.exist(gameObject.zone);
            zone.containsObject(gameObject).should.be.false;
        })
    })

    describe('Entities', () => {
        var template : ZoneTemplate = _.clone(zoneTemplate);
        var visibleRange = 30;
        var forgetRange = 60;

        template['area'] = {
            'visibleRange' : visibleRange,
            'forgetRange' : forgetRange
        };
        var zone: Zone = new Zone(template);
        var user = new User(0, 'TestUser');
        var playerA = new Player(0, user);
        var playerB = new Player(1, user);

        it ('Should see nearby objects', () => {
            var position = new Position(0, 0);
            zone.addPlayer(playerA, position);
            playerA.knownObjects.contains(playerB).should.be.false;
            playerB.knownObjects.contains(playerA).should.be.false;

            zone.addPlayer(playerB, position);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
        });

        it ('Should see objects moving within visible range', () => {
            zone.setObjectPosition(playerA, 10, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;

            zone.setObjectPosition(playerA, 20, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;

            zone.setObjectPosition(playerA, forgetRange-1, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;
        });

        it('Should forget entities that move outside the forget range', () => {
            zone.setObjectPosition(playerA, 0, 0);
            zone.setObjectPosition(playerB, 0, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;

            zone.setObjectPosition(playerA, forgetRange+1, 0);
            playerA.knownObjects.contains(playerB).should.be.false;
            playerB.knownObjects.contains(playerA).should.be.false;
        });

        it('Should forget removed objects', () => {
            zone.setObjectPosition(playerA, 0, 0);
            zone.setObjectPosition(playerB, 0, 0);
            playerA.knownObjects.contains(playerB).should.be.true;
            playerB.knownObjects.contains(playerA).should.be.true;

            zone.removePlayer(playerB);
            playerA.knownObjects.contains(playerB).should.be.false;
        })

    });

    //it ('Should add and remove objects', () => {
    //    var zone = new Zone(template);
    //    var object = new GameObject();
    //    var position = new Position(5, 5);
    //
    //    zone.addObject(object, position);
    //    zone.containsObject(object).should.be.true;
    //    zone.removeObject(object);
    //    zone.containsObject(object).should.be.false;
    //});
    //
    //it ('Add and remove players', () => {
    //    var template = _.clone(template);
    //    template.maxPlayers = 1;
    //    var zone = new Zone(template);
    //    var position = new Position(5, 5);
    //
    //    var user = new User(0, 'TestUser');
    //    var player1 = new Player(user);
    //    var player2 = new Player(user);
    //
    //    zone.addPlayer(player1, position).should.be.true;
    //
    //    zone.addPlayer(player1, position).should.be.false;
    //
    //});

});
