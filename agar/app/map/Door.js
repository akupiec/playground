import {LineShape} from './LineShape';
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
        this._line = new LineShape(p0, p1);
    }

    getLine() {
        return this._line;
    }

    paintOnMap(mapData) {
        this._line.paintOnMap(mapData, SPRITE_DATA[0].door);
    }

}

export {
    DOOR_TYPES,
    Door
};
