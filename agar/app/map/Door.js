import {Line} from "../math/Line";
import {Point} from "../math/Point";
const SPRITE_DATA = require('./lvl0_tile.json');


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

    paintOnMap(mapData) {
        if (this._line.isHorizontal()) {
            for (let i = this._line.p0.x; i < this._line.p1.x; i++) {
                mapData.setVal(i, this._line.p0.y, SPRITE_DATA[0].door)
            }
        } else if (this._line.isVertical()) {
            for (let i = this._line.p0.y; i < this._line.p1.y; i++) {
                mapData.setVal(this._line.p0.x, i, SPRITE_DATA[0].door)
            }
        }
    }

}

export {
    DOOR_TYPES,
    Door
};
