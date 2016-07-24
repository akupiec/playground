require('seedrandom');
var _ = require('underscore');
var marsagliaPolar = require('../lib/marsaglia-polar');
var Rectangle = require("./math/Rectangle");
var TSP = require('../lib/tsp/algorithm');
var Circle = require('./math/Circle');
var Room = require('./map/Room').Room;
var ROOM_TYPES = require('./map/Room').ROOM_TYPES;
var Map = require('./map/Map');

var MyMath = require('./math/common');


// Math.seedrandom('hedddd6');
const rooms_num = 500; // (0, }
const gen_radius = 0.5; // (0;1)
const gen_range_w = 1000; // (0, }
const gen_range_h = 1000; // (0, }
const max_room_size = 40; // (0, }
const min_room_size = 10; // (0, }
const separation_force = 8; // (0, }
const main_room_size = 1.2;
const extraEdgesCorridors = 0.1;
const corridor_width = 10;
const gen_world_bound = 450;


module.exports = class MapGenerator {
    generate() {
        console.time('generation');
        this._worldBound = this._genWorldBounds();
        var rectangles = this._genRects();
        this._allRooms = this._genRooms(rectangles);
        this._repositionRooms();
        this._orderRooms();

        console.timeEnd('generation');
    }

    getRooms() {
        return this._allRooms;
    }

    _genWorldBounds() {
        return new Circle(gen_range_w / 2, gen_range_h / 2, gen_world_bound);
    }

    _orderRooms() {
        var points = this._getMainRooms().map((room)=> {
            return room.getCenter();
        });
        TSP.GAInitialize(points);
        var best;
        for (let i = 0; i < 20; i++) {
            best = TSP.GANextGeneration();
        }
    }

    _getMainRooms() {
        return _.filter(this._allRooms, (room) => {
            return room.isMain();
        });
    }

    _genRects() {
        function _genRectPosition() {
            let rectPosition = MyMath.randomPointInCircle(gen_radius);
            rectPosition.x = MyMath.normalizeRandomRange(++rectPosition.x, 0, gen_range_w / 2);
            rectPosition.y = MyMath.normalizeRandomRange(++rectPosition.y, 0, gen_range_h / 2);
            return rectPosition;
        }

        function _genRectSize() {
            const sizeW = Math.abs(marsagliaPolar.simpleRandom());
            const sizeH = Math.abs(marsagliaPolar.simpleRandom());
            return {
                w: MyMath.normalizeRandomRange(sizeW, min_room_size, max_room_size),
                h: MyMath.normalizeRandomRange(sizeH, min_room_size, max_room_size)
            };
        }

        var rectangles = [];
        for (let i = 0; i < rooms_num; i++) {
            const roomPosition = _genRectPosition();
            const size = _genRectSize();
            rectangles.push(new Rectangle(roomPosition.x, roomPosition.y, size.w, size.h));
        }

        return rectangles;
    }

    _repositionRooms() {
        let rooms = this._allRooms;
        let runAgain;
        do {
            runAgain = false;
            for (let i = 0; i < rooms.length; i++) {
                const a = rooms[i].getBounds();
                if (!this._worldBound.rectInside(a)) {
                    runAgain = true;
                    rooms.splice(i, 1);
                    break;
                }
                for (let j = i + 1; j < rooms.length; j++) {
                    const b = rooms[j].getBounds();
                    if (a.overlaps(b, separation_force)) {
                        const delta = a.minSeparationVector(b, separation_force);
                        a.move(-delta.x / 2, -delta.y / 2);
                        b.move(delta.x / 2, delta.y / 2);
                        runAgain = true;
                    }
                }
            }
        } while (runAgain);
    }

    _genRooms(rectangles) {
        var sumW = 0;
        var sumH = 0;
        rectangles.map((rect) => {
            sumW += rect.width;
            sumH += rect.height;
        });
        const meanW = sumW / rooms_num;
        const meanH = sumH / rooms_num;
        return rectangles.map((rect) => {
            const room = new Room(rect);
            if (rect.width > main_room_size * meanW && rect.height > main_room_size * meanH) {
                room.addType(ROOM_TYPES.MAIN);
            }
            return room;
        });
    }
};
