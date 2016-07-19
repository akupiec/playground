import _ from 'underscore';
import * as marsagliaPolar from '../lib/marsaglia-polar';
import {Rectangle} from "./math/Rectangle";
import {Line} from "./math/Line";
import {Point} from "./math/Point";
var triangulate = require("delaunay-triangulate");
import {kruskal} from '../lib/kruskal';

import * as MyMath from './math/common'

Math.seedrandom('hedddd6');
const rooms_num = 100; // (0, }
const gen_radius = 0.2; // (0;1)
const gen_range_w = 1000; // (0, }
const gen_range_h = 1000; // (0, }
const max_room_size = 40; // (0, }
const min_room_size = 10; // (0, }
const separation_force = 2; // (0, }
const main_room_size = 1.2;
const extraEdgesCorridors = 0.1;
const corridor_width = 10;

const ROOM_TYPES = Object.freeze({
    MAIN: 0,
    CORRIDOR: 1,
    CORRIDOR_ROOM: 2,
});

class Room {
    constructor(rect) {
        this.rect = rect;
        this._types = [];
    }

    getBounds() {
        return this.rect;
    }

    getCenter() {
        return {
            x: this.rect.x + this.rect.width / 2,
            y: this.rect.y + this.rect.height / 2
        }
    }

    addType(type) {
        if (!this.isType(type)) {
            this._types.push(type);
        }
    }

    isType(type) {
        return this._types.indexOf(type) !== -1;
    }

    isMain() {
        return this.isType(ROOM_TYPES.MAIN);
    }

    isCorridorRoom() {
        return this.isType(ROOM_TYPES.CORRIDOR_ROOM)
    }

    isCorridor() {
        return this.isType(ROOM_TYPES.CORRIDOR);
    }
}

export default class MapGenerator {
    generate() {
        console.time('generation');
        var rectangles = this._genRect();
        rectangles = this._repositionRect(rectangles); //TODO its freaking slow!
        this._allRooms = this._genRooms(rectangles);
        var mainRooms = this._getMainRooms();
        this._edges = this._genSpanTreeEdges(mainRooms);
        this._corridorOutlines = this._genCorridorOutlines(this._edges);

        let _corridorRectangles = _.flatten(this._genCorridorsRectangles(this._corridorOutlines));
        this._corridors = this._genCorridors(_corridorRectangles);
        this._detectUnUsed(this._corridors);

        console.timeEnd('generation');
    }

    getRooms() {
        return this._allRooms;
    }



    _getMainRooms() {
        return _.filter(this._allRooms, (room) => {
            return room.isMain();
        });
    }

    _getMinorRooms() {
        return _.filter(this._allRooms, (room) => {
            return !room.isMain();
        });
    }

    _genPosition() {
        let rectPosition = MyMath.randomPointInCircle(gen_radius);
        rectPosition.x = MyMath.normalizeRandomRange(++rectPosition.x, 0, gen_range_w / 2);
        rectPosition.y = MyMath.normalizeRandomRange(++rectPosition.y, 0, gen_range_h / 2);
        return rectPosition;
    }

    _genSize() {
        const sizeW = Math.abs(marsagliaPolar.simpleRandom());
        const sizeH = Math.abs(marsagliaPolar.simpleRandom());
        return {
            w: MyMath.normalizeRandomRange(sizeW, min_room_size, max_room_size),
            h: MyMath.normalizeRandomRange(sizeH, min_room_size, max_room_size)
        };
    }

    _genRect() {
        var rectangles = [];
        for (let i = 0; i < rooms_num; i++) {
            const roomPosition = this._genPosition();
            const size = this._genSize();
            rectangles.push(new Rectangle(roomPosition.x, roomPosition.y, size.w, size.h));
        }

        return rectangles;
    }

    _repositionRect(rectangles) {
        let runAgain;
        do {
            runAgain = false;
            for (let i = 0; i < rectangles.length; i++) {
                const a = rectangles[i];
                for (let j = i + 1; j < rectangles.length; j++) {
                    const b = rectangles[j];
                    if (a.overlaps(b, separation_force)) {
                        const delta = a.separationVector(b, separation_force);
                        a.move(-delta.x / 2, -delta.y / 2);
                        b.move(delta.x / 2, delta.y / 2);
                        runAgain = true;
                    }
                }
            }
        } while (runAgain);

        return rectangles;
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

    _genSpanTreeEdges(nodes) {
        let points = nodes.map((room) => {
            const center = room.getCenter();
            return [center.x, center.y];
        });

        let cells = triangulate(points);
        points = null;
        let edges = [];
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            for (let j = 1; j < cell.length; j++) {
                const nodeA = nodes[cell[j - 1]];
                const nodeB = nodes[cell[j]];
                const distance = MyMath.distanceBetweenPoints(nodeA.getCenter(), nodeB.getCenter());
                edges.push([nodeA, nodeB, distance]);
            }
        }
        cells = null;

        let newEdges = kruskal(nodes, edges);
        let rejectedEdges = _.difference(edges, newEdges);
        const additionalEdges = Math.floor(rejectedEdges.length * extraEdgesCorridors);
        for (let i = 0; i < additionalEdges; i++) {
            let idx = Math.floor(MyMath.normalizeRandomRange(Math.random(), 0, rejectedEdges.length - 1));
            newEdges.push(rejectedEdges[idx]);
            rejectedEdges.splice(idx, 1);
        }

        return newEdges;
    }

    /**
     * @param edges
     * @returns {Array<Line>}
     * @private
     */
    _genCorridorOutlines(edges) {
        return edges.map((edge) => {
            const a = edge[0].getBounds();
            const b = edge[1].getBounds();
            const dX = Math.min(a.getRight() - b.getLeft(), b.getRight() - a.getLeft());
            const dY = Math.min(a.getTop() - b.getBottom(), b.getTop() - a.getBottom());
            if (dY < a.height && dY > 0) {
                const dY2 = dY / 2;
                if (a.y > b.y) {
                    return [new Line(
                        new Point(a.x, a.y + dY2),
                        new Point(b.x + b.width, a.y + dY2)
                    )];
                } else {
                    return [new Line(
                        new Point(b.x, b.y + dY2),
                        new Point(a.x + a.width, b.y + dY2)
                    )];
                }
            }
            else if (dX < a.width && dX > 0) {
                const dX2 = dX / 2;
                if (a.x > b.x) {
                    return [new Line(
                        new Point(a.x + dX2, a.y),
                        new Point(a.x + dX2, b.y + b.height)
                    )];
                } else {
                    return [new Line(
                        new Point(b.x + dX2, b.y),
                        new Point(b.x + dX2, a.y + a.height)
                    )];
                }
            } else {
                const centerA = a.getCenter();
                const centerB = b.getCenter();
                return [
                    new Line(
                        new Point(centerA.x, centerA.y),
                        new Point(centerB.x, centerA.y)
                    ),
                    new Line(
                        new Point(centerB.x, centerA.y),
                        new Point(centerB.x, centerB.y)
                    )
                ];
            }
        });
    }

    _genCorridorsRectangles(corridorOutlines) {
        return corridorOutlines.map((lines) => {
            return lines.map((line) => {
                const rect = line.toRectangle(corridor_width);
                if (lines.length > 1 && line.isVertical()) {
                    rect.width += corridor_width;
                }
                return rect;
            })
        })
    }

    _genCorridors(corridorRects) {
        return corridorRects.map((rect) => {
            const r = new Room(rect);
            r.addType(ROOM_TYPES.CORRIDOR);
            return r;
        });
    }

    _detectUnUsed(corridors) {
        this._allRooms.map((room) => {
            corridors.map((corridor) => {
                if (!room.isMain() && room.getBounds().overlaps(corridor.getBounds())) {
                    room.addType(ROOM_TYPES.CORRIDOR_ROOM)
                }
            })
        })
    }

}