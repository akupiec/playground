class Room {
    constructor(rect) {
        this.rect = rect;
        this._types = [];
        this._order = -1;
        this._doors = [];
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