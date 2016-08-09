var assert = require('chai').assert;
import {MapData} from "../app/map/MapData";

describe('MapData', function () {
    it('should initialize size', function () {
        var map = new MapData(5, 10);
        assert.deepEqual(map.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
    });

    it('should getIndex', function () {
        var map = new MapData(5, 10);
        assert.equal(map.getIndex(0, 0), 0);
        assert.equal(map.getIndex(0, 1), 5);
        assert.equal(map.getIndex(0, 2), 10);
        assert.equal(map.getIndex(1, 1), 6);
        assert.equal(map.getIndex(3, 2), 13);
    });

    it('should setVal', function () {
        var map = new MapData(5, 5);
        assert.deepEqual(map.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        map.setVal(1, 1, 1);
        assert.deepEqual(map.data, [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        map.setVal(5, 0, -666);
        map.setVal(1, 1, 3);
        assert.deepEqual(map.data, [0, 0, 0, 0, 0, -666, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
    });

});