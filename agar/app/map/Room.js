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

const ROOM_TYPES = Object.freeze({
    MAIN: 0,
    CORRIDOR: 1,
    CORRIDOR_ROOM: 2,
});

module.exports = {
    Room,
    ROOM_TYPES,
};