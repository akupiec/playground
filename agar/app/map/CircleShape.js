import Circle from "../math/Circle";
const SPRITE_DATA = require('./lvl0_tile.json');

export class CircleShape extends Circle {
    paintOnMap(mapData) {
        var dataVal = SPRITE_DATA[0].wall;
        let x = this.r;
        let y = 0;
        let err = 0;

        while (x >= y) {
            mapData.setVal(this.x + x, this.y + y, dataVal);
            mapData.setVal(this.x + y, this.y + x, dataVal);
            mapData.setVal(this.x - y, this.y + x, dataVal);
            mapData.setVal(this.x - x, this.y + y, dataVal);
            mapData.setVal(this.x - x, this.y - y, dataVal);
            mapData.setVal(this.x - y, this.y - x, dataVal);
            mapData.setVal(this.x + y, this.y - x, dataVal);
            mapData.setVal(this.x + x, this.y - y, dataVal);

            y += 1;
            err += 1 + 2 * y;
            if (2 * (err - x) + 1 > 0) {
                x -= 1;
                err += 1 - 2 * x;
            }

        }
    }
}