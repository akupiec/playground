var assert = require('chai').assert;
import {Rectangle} from '../app/math/Rectangle';
import {Room, ROOM_TYPES} from '../app/map/Room';
import {MapData} from "../app/map/MapData";
import {Door, DOOR_TYPES} from "../app/map/Door";

describe('Room', function () {
    it('should set room type', function () {
        var rect = new Rectangle(0, 0, 10, 10);
        var room = new Room(rect);
        assert.equal(room._types.length, 0);
        room.addType(ROOM_TYPES.SECRET);
        room.addType(ROOM_TYPES.MAIN);
        assert.equal(room._types.length, 2);
    });

    it('should check is Main type', function () {
        var rect = new Rectangle(0, 0, 10, 10);
        var room = new Room(rect);
        assert.isFalse(room.isMain());
        room.addType(ROOM_TYPES.MAIN);
        assert.isTrue(room.isMain());
    });

    it('should paint walls', function () {
        var rect = new Rectangle(1, 0, 4, 4);
        var room = new Room(rect);
        var mapData = new MapData(5, 5);
        const wallValue = 5;
        const floorVal = 4;

        room.addType(ROOM_TYPES.MAIN);
        assert.deepEqual(mapData.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        room.paintOnMap(mapData);

        assert.deepEqual(mapData.data, [
            0, wallValue, wallValue, wallValue, wallValue,
            0, wallValue, floorVal, floorVal, wallValue,
            0, wallValue, floorVal, floorVal, wallValue,
            0, wallValue, wallValue, wallValue, wallValue,
            0, 0, 0, 0, 0]
        );
    });

    it('should paint walls with doors', function () {
        var rect = new Rectangle(1, 0, 4, 4);
        var room = new Room(rect);
        var door = new Door(2, 0, 2, DOOR_TYPES.HORIZONTAL);
        var mapData = new MapData(5, 5);
        const floorVal = 4;
        const wallValue = 5;
        const doorValue = 11;

        room.addType(ROOM_TYPES.MAIN);
        room.addDoor(door);
        assert.deepEqual(mapData.data,
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        );
        room.paintOnMap(mapData);

        assert.deepEqual(mapData.data, [
            0, wallValue, doorValue, doorValue, wallValue,
            0, wallValue, floorVal, floorVal, wallValue,
            0, wallValue, floorVal, floorVal, wallValue,
            0, wallValue, wallValue, wallValue, wallValue,
            0, 0, 0, 0, 0]
        );
    });
});