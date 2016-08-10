import {Line} from "../math/Line";


export class LineShape extends Line {
    paintOnMap(mapData, value) { //Bresenham's line algorithm
        const x0 = this.p0.x;
        const x1 = this.p1.x;
        const y0 = this.p0.y;
        const y1 = this.p1.y;
        const dx = x1 - x0;
        const dy = y1 - y0;
        let dr = dy - dx;
        let y = y0;

        if (dx === 0) { //vertical
            for (; y < y1; y++) {
                mapData.setVal(x0, y, value);
            }
            return;
        }
        for (let x = x0; x < x1; x++) {
            mapData.setVal(x, y, value);
            if (dr >= 0) {
                y += 1;
                dr -= dx;
            }
            dr += dy;
        }
    }
}