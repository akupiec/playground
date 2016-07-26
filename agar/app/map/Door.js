var Line = require('../math/Line');
var Point = require('../math/Point');

const DOOR_TYPES = {
    HORIZONTAL: 0,
    VERTICAL: 1,
};

class Door {
    constructor(x, y, w, type) {
        let p0 = new Point(x, y);
        let p1 = new Point(x, y + w);
        if (type === DOOR_TYPES.HORIZONTAL) {
            p1 = new Point(x + w, y);
        }
        this._line = new Line(p0, p1);
    }

    getLine() {
        return this._line;
    }
}

module.exports = {
    DOOR_TYPES,
    Door
};
