require('seedrandom');
import _ from 'underscore';
import {CircleShape} from "./map/CircleShape";
import {MapData} from "./map/MapData";
import {Room, ROOM_TYPES} from "./map/Room";
import {Door, DOOR_TYPES} from "./map/Door";
import * as TSP from "../lib/tsp/algorithm";
import {Rectangle} from "./math/Rectangle";
import * as MyMath from "./math/common";
import * as marsagliaPolar from "../lib/marsaglia-polar";


const initConfig = {
    seed: 'hedddd4',
    rooms_num: 500, // (0, }
    gen_range_w: 1000, // (0, }
    gen_range_h: 1000, // (0, }
    max_room_size: 40, // (0, }
    min_room_size: 10, // (0, }
    separation_force: 8, // (0, }
    gen_world_bound: 450,
    door_size: 5,
    gen_radius: 0.5, // (0;1)
    main_room_size: 1.2,
    secret_chance: 0.3,
};

export class MapGenerator {
    generate(config = initConfig) {
        Math.seedrandom(config.seed);
        this.config = config;

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
        const rawData = new MapData(this.config.gen_range_w, this.config.gen_range_h);
        this._allRooms.map((room) => {
            room.paintOnMap(rawData);
        });
        this._worldBound.paintOnMap(rawData);
        return rawData;
    }

    _genWorldBounds() {
        return new CircleShape(this.config.gen_range_w / 2, this.config.gen_range_h / 2, this.config.gen_world_bound);
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
        const _genRectPosition = () => {
            let rectPosition = MyMath.randomPointInCircle(this.config.gen_radius);
            rectPosition.x = MyMath.normalizeRandomRange(++rectPosition.x, 0, this.config.gen_range_w / 2);
            rectPosition.y = MyMath.normalizeRandomRange(++rectPosition.y, 0, this.config.gen_range_h / 2);
            return rectPosition;
        };

        const _genRectSize = () => {
            const sizeW = Math.abs(marsagliaPolar.simpleRandom());
            const sizeH = Math.abs(marsagliaPolar.simpleRandom());
            return {
                w: MyMath.normalizeRandomRange(sizeW, this.config.min_room_size, this.config.max_room_size),
                h: MyMath.normalizeRandomRange(sizeH, this.config.min_room_size, this.config.max_room_size)
            };
        };

        var rectangles = [];
        for (let i = 0; i < this.config.rooms_num; i++) {
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
                    if (a.overlapsFloor(b, this.config.separation_force)) {
                        const delta = a.minSeparationVector(b, this.config.separation_force);
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
        const meanW = sumW / this.config.rooms_num;
        const meanH = sumH / this.config.rooms_num;
        return rectangles.map((rect) => {
            const room = new Room(rect);
            if (rect.width > this.config.main_room_size * meanW && rect.height > this.config.main_room_size * meanH) {
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
            if (room.getOrder() > endIdx && Math.random() <= this.config.secret_chance) {
                room.addType(ROOM_TYPES.SECRET);
            }

        }
    }

    _genDoors() {
        // const rooms = this._getMainRooms();
        const rooms = this._allRooms;
        rooms.map((room) => {
            // var numOfDoors = Math.round(MyMath.normalizeRandomRange(Math.random, 1, 4));
            var rect = room.getBounds();

            room.addDoor(new Door(Math.round(rect.x + rect.width / 2 - this.config.door_size / 2), rect.y, this.config.door_size, DOOR_TYPES.HORIZONTAL));
            room.addDoor(new Door(Math.round(rect.x + rect.width / 2 - this.config.door_size / 2), rect.getBottom() - 1, this.config.door_size, DOOR_TYPES.HORIZONTAL));
            room.addDoor(new Door(rect.x, Math.round(rect.y + rect.height / 2 - this.config.door_size / 2), this.config.door_size, DOOR_TYPES.VERTICAL));
            room.addDoor(new Door(rect.getRight() - 1, Math.round(rect.y + rect.height / 2 - this.config.door_size / 2), this.config.door_size, DOOR_TYPES.VERTICAL));
        })
    }
}
