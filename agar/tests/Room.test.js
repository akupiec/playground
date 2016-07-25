var assert = require('chai').assert;
var Rectangle = require('../app/math/Rectangle');
var Room = require('../app/map/Room').Room;
var ROOM_TYPES = require('../app/map/Room').ROOM_TYPES;

describe('Room', function () {
    it('should set room type', function () {
        var rect = new Rectangle(0, 0, 10, 10);
        var room = new Room(rect);
        assert.equal(room._types.length, 0);
        room.addType(ROOM_TYPES.CORRIDOR);
        room.addType(ROOM_TYPES.CORRIDOR_ROOM);
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