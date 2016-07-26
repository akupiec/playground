var assert = require('chai').assert;
import {Rectangle} from '../app/math/Rectangle';
import {Room, ROOM_TYPES} from '../app/map/Room';

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
        assert.equal(room._types.length, 0);
        room.addType(ROOM_TYPES.MAIN);
        assert.equal(room._types.length, 1);
        assert.isTrue(room.isMain());
    });
});