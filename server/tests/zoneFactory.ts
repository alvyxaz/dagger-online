/// <reference path='../src/types' />
import chai = require('chai');
import _ = require('lodash');

var should = chai.should();
var expect = chai.expect;

import MessageCode = require('../src/common/MessageCode');

import Zone = require('../src/gameServer/models/Zone');
import ZoneTemplate = require('../src/gameServer/templates/ZoneTemplate');
import Player = require('../src/gameServer/models/Player');
import User = require('../src/gameServer/models/User');
import Position = require('../src/gameServer/models/Position');
import ZoneType = require('../src/gameServer/enums/ZoneType');
import GameObject =  require('../src/gameServer/models/GameObject');
import Character =  require('../src/gameServer/models/Character');

import ZoneFactory = require('../src/gameServer/factories/ZoneFactory');

var templateId = 'Test';


var zoneTemplate : ZoneTemplate = {
    'name' : 'Test',
    'templateId' : templateId,
    'maxPlayers' : 5,
    'type' : ZoneType.World,
    'data' : {},
    'scene' : 'world',
    'positions' : [
        {'name' : 'start', 'position' : [1, 2, 3]}
    ],
    area : {
        visibleRange: 3,
        forgetRange : 5
    }
};

describe('Zone Factory', () => {
    var factory = new ZoneFactory();

    it('Should allow adding templates', () => {
        should.not.exist(factory.getTemplate(templateId));
        factory.addTemplate(zoneTemplate);
        should.exist(factory.getTemplate(templateId));
    });

    it('Should initialize from zone template', () => {
        should.not.exist(factory.createZone('unexistingTemplateId'));

        var zone = factory.createZone(templateId);
        should.exist(zone);

        it('Should contain spawned objects', () => {

        });
    });

});

