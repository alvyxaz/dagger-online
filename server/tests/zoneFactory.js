var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var ZoneType = require('../src/gameServer/enums/ZoneType');
var ZoneFactory = require('../src/gameServer/factories/ZoneFactory');
var templateId = 'Test';
var zoneTemplate = {
    'name': 'Test',
    'templateId': templateId,
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
describe('Zone Factory', function () {
    var factory = new ZoneFactory();
    it('Should allow adding templates', function () {
        should.not.exist(factory.getTemplate(templateId));
        factory.addTemplate(zoneTemplate);
        should.exist(factory.getTemplate(templateId));
    });
    it('Should initialize from zone template', function () {
        should.not.exist(factory.createZone('unexistingTemplateId'));
        var zone = factory.createZone(templateId);
        should.exist(zone);
        it('Should contain spawned objects', function () {
        });
    });
});
//# sourceMappingURL=zoneFactory.js.map