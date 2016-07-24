require('seedrandom');
var _ = require('underscore');
var marsagliaPolar = require('../lib/marsaglia-polar');
var Rectangle = require("./math/Rectangle");
var Line = require("./math/Line");
var Point = require("./math/Point");
var triangulate = require("delaunay-triangulate");
var kruskal = require('../lib/kruskal');
var TSP = require('../lib/tsp/algorithm');

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

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    rectInside(rect) {
        const A = this;
        var a = new Point(A.x, A.y);
        var b = new Point(rect.x, rect.y);
        const dist = MyMath.distanceBetweenPoints(a, b);
        return dist < this.r;
    }

    getRaw() {
        return [this.x, this.y, this.r];
    }
}

module.exports = class MapGenerator {
    generate() {
        console.time('generation');
        this._worldBound = this._genWorldBounds();
        var rectangles = this._genRect();
        this._allRooms = this._genRooms(rectangles);
        this._repositionRooms();
        this._orderRooms();

        // this._edges = this._genSpanTreeEdges(mainRooms);
        // this._corridorOutlines = this._genCorridorOutlines(this._edges);
        //
        // let _corridorRectangles = _.flatten(this._genCorridorsRectangles(this._corridorOutlines));
        // this._corridors = this._genCorridors(_corridorRectangles);
        // this._detectUnUsed(this._corridors);

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
                        const delta = a.minSeparationVector(b, separation_force);
                        a.move(-delta.x / 2, -delta.y / 2);
                        b.move(delta.x / 2, delta.y / 2);
                        runAgain = true;
                    }
                }
            }
        } while (runAgain);

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
            return MapGenerator.connectRects(a, b);
        });
    }

    static connectibleVertically(A, B, offset = 0) {
        return (A.x <= B.x && A.getRight() - offset >= B.x) ||
            (A.x + offset <= B.getRight() && A.getRight() >= B.getRight()) ||
            (A.x <= B.x && A.getRight() >= B.getRight()) ||
            (A.x >= B.x && A.getRight() <= B.getRight());
    }

    static connectibleHorizontally(A, B, offset = 0) {
        return (A.y <= B.y && A.getBottom() - offset >= B.y ) ||
            (A.y + offset <= B.getBottom() && A.getBottom() >= B.getBottom()) ||
            (A.y <= B.y && A.getBottom() >= B.getBottom()) ||
            (A.y >= B.y && A.getBottom() <= B.getBottom());
    }

    static connectRects(A, B) {
        const offset = separation_force + corridor_width;
        var line1, line2, p0, p1, randomY, randomX;
        const x = Math.max(A.x, B.x);
        const r = Math.min(A.getRight(), B.getRight());
        const dX = (x - r) / 2;

        const y = Math.max(A.y, B.y);
        const b = Math.min(A.getBottom(), B.getBottom());
        const dY = (y - b) / 2;

        if (this.connectibleHorizontally(A, B, offset)) {
            randomY = MyMath.normalizeRandomRange(Math.random(), y + offset, b - offset);
            if (y + offset > b - offset) {
                randomY = y + separation_force;
            }
            p0 = new Point(r, randomY);
            p1 = new Point(x, randomY);
            return [];
            return [new Line(p0, p1)];
        }

        if (this.connectibleVertically(A, B, offset)) {
            randomX = MyMath.normalizeRandomRange(Math.random(), x + offset, r - offset);
            if (x + offset > r - offset) {
                randomX = x + separation_force;
            }
            p0 = new Point(randomX, b);
            p1 = new Point(randomX, y);
            return [];
            return [new Line(p0, p1)];
        }

        return this.connectRectsL(A, B);
    }

    static connectRectsL(A, B) {
        const centerA = A.getCenter();
        const centerB = B.getCenter();

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

};
