require('seedrandom');
import _ from 'underscore';
import {CircleShape} from "./map/CircleShape";
import {MapData} from "./map/MapData";
import Circle from "./math/Circle";
import {Room, ROOM_TYPES} from "./map/Room";
import {Door, DOOR_TYPES} from "./map/Door";
import * as TSP from "../lib/tsp/algorithm";
import {Rectangle} from "./math/Rectangle";
import * as MyMath from "./math/common";
import * as marsagliaPolar from "../lib/marsaglia-polar";


// Math.seedrandom('hedddd6');
const rooms_num = 500; // (0, }
const gen_radius = 0.5; // (0;1)
const gen_range_w = 1000; // (0, }
const gen_range_h = 1000; // (0, }
const max_room_size = 40; // (0, }
const min_room_size = 10; // (0, }
const separation_force = 8; // (0, }
const main_room_size = 1.2;
const gen_world_bound = 450;
const secret_chance = 0.3;
const door_size = 5;

export class MapGenerator {
    generate() {
        console.time('generation');
        this._worldBound = this._genWorldBounds();
        var rectangles = this._genRects();
        this._allRooms = this._genRooms(rectangles);
        this._repositionRooms();
        this._snapRoomsToGrid();
        this._orderRooms();
        this._getExtraRoomsInfo();
        this._genDoors();

        console.timeEnd('generation');
    }

    getRooms() {
        return this._allRooms;
    }

    getMapData() {
        const rawData = new MapData(gen_range_w, gen_range_h);
        this._allRooms.map((room) => {
            room.paintOnMap(rawData);
        });
        this._worldBound.paintOnMap(rawData);
        return rawData;
    }

    _genWorldBounds() {
        return new CircleShape(gen_range_w / 2, gen_range_h / 2, gen_world_bound);
    }

    _orderRooms() {
        const rooms = this._getMainRooms();
        console.assert(rooms.length > 0);

        var points = rooms.map((room) => room.getCenter());
        TSP.GAInitialize(points);
        var best = [];
        for (let iteration = 0; iteration < 10; iteration++) {
            best = TSP.GANextGeneration();
        }

        for (var i = 0; i < best.length; i++) {
            var bestVal = best[i];
            const room = rooms[bestVal];
            room.setOrder(i);
        }

        rooms[best[0]].addType(ROOM_TYPES.START);
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
                    if (a.overlapsFloor(b, separation_force)) {
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

    _snapRoomsToGrid() {
        this._allRooms.map((room) => {
            room.getBounds().snapToGrid();
        })
    }

    _getExtraRoomsInfo() {
        const rooms = this._getMainRooms();
        var endIdx = Math.floor(MyMath.normalizeRandomRange(Math.random(), rooms.length - 6, rooms.length));

        for (var i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            if (room.getOrder() === endIdx) {
                room.addType(ROOM_TYPES.END);
            }
            if (room.getOrder() > endIdx && Math.random() <= secret_chance) {
                room.addType(ROOM_TYPES.SECRET);
            }

        }
    }

    _genDoors() {
        const rooms = this._getMainRooms();
        rooms.map((room) => {
            // var numOfDoors = Math.round(MyMath.normalizeRandomRange(Math.random, 1, 4));
            var rect = room.getBounds();

            room.addDoor(new Door(rect.x + rect.width / 2, rect.y, door_size, DOOR_TYPES.HORIZONTAL));
            room.addDoor(new Door(rect.x + rect.width / 2, rect.getBottom(), door_size, DOOR_TYPES.HORIZONTAL));
            room.addDoor(new Door(rect.x, rect.y + rect.height / 2, door_size, DOOR_TYPES.VERTICAL));
            room.addDoor(new Door(rect.getRight(), rect.y + rect.height / 2, door_size, DOOR_TYPES.VERTICAL));
        })
    }
}
