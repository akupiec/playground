var assert = require('chai').assert;
import {Door, DOOR_TYPES} from "../app/map/Door";
import {MapData} from "../app/map/MapData";

describe('Door', function () {

    it('should paint onMap H', function () {
        var door = new Door(2, 0, 2, DOOR_TYPES.HORIZONTAL);
        var mapData = new MapData(3, 3);
        const doorValue = 11;

        assert.deepEqual(mapData.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        door.paintOnMap(mapData);

        assert.deepEqual(mapData.data,
            [0, 0, doorValue, doorValue, 0, 0, 0, 0, 0]
        );
    });

    it('should paint onMap V', function () {
        var door = new Door(2, 0, 2, DOOR_TYPES.VERTICAL);
        var mapData = new MapData(3, 3);
        const doorValue = 11;

        assert.deepEqual(mapData.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        door.paintOnMap(mapData);

        assert.deepEqual(mapData.data,
            [0, 0, doorValue, 0, 0, doorValue, 0, 0, 0]
        );
    });

    it('should init horizontal', function () {
        var door = new Door(2, 0, 2, DOOR_TYPES.HORIZONTAL);
        assert.deepEqual(door.getLine().getRaw(), [{x: 2, y: 0}, {x: 4, y: 0}]);
    });

    it('should init vertical', function () {
        var door = new Door(2, 0, 2, DOOR_TYPES.VERTICAL);
        assert.deepEqual(door.getLine().getRaw(), [{x: 2, y: 0}, {x: 2, y: 2}]);
    })
});