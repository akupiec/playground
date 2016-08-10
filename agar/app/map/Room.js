const SPRITE_DATA = require('./lvl0_tile.json');


class Room {
    constructor(rect) {
        this._rect = rect;
        this._types = [];
        this._order = -1;
        this._doors = [];
        this._spriteSet = 0;
    }

    getBounds() {
        return this._rect;
    }

    getCenter() {
        return {
            x: this._rect.x + this._rect.width / 2,
            y: this._rect.y + this._rect.height / 2
        }
    }

    addType(type) {
        if (!this.isType(type)) {
            this._types.push(type);
        }
    }

    isType(type) {
        const val = this._types.indexOf(type);
        return val !== -1 && val !== undefined;
    }

    isMain() {
        return this.isType(ROOM_TYPES.MAIN);
    }

    isStart() {
        return this.isType(ROOM_TYPES.START);
    }

    isEnd() {
        return this.isType(ROOM_TYPES.END);
    }

    isSecret() {
        return this.isType(ROOM_TYPES.SECRET);
    }

    setOrder(order) {
        this._order = order;
    }

    getOrder() {
        return this._order;
    }

    addDoor(door) {
        this._doors.push(door);
    }

    getDoors() {
        return this._doors;
    }

    paintOnMap(mapData) {
        function paintWalls() {
            const wallValue = SPRITE_DATA[this._spriteSet].wall;
            const floorValue = SPRITE_DATA[this._spriteSet].floor;
            for (var j = this._rect.y; j < this._rect.getBottom(); j++) {
                for (var i = this._rect.x; i < this._rect.getRight(); i++) {
                    if (j === this._rect.y || j === this._rect.getBottom() - 1 || i === this._rect.x || i === this._rect.getRight() - 1) {
                        mapData.setVal(i, j, wallValue);
                    } else {
                        mapData.setVal(i, j, floorValue)
                    }
                }
            }
        }

        paintWalls.call(this);
        this._doors.map((door) => {
            door.paintOnMap(mapData);
        });
    }
}

const ROOM_TYPES = Object.freeze({
    MAIN: 0,
    START: 1,
    END: 2,
    SECRET: 3,
});

export {
    Room,
    ROOM_TYPES,
};