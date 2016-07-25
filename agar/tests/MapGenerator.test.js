var assert = require('chai').assert;
var MapGenerator = require('../app/MapGenerator');


describe('MapGenerator', function () {
    var generator;
    beforeEach(function () {
        generator = new MapGenerator();
    });
    afterEach(function () {
        generator = null;
    });
});