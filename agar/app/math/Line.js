import {Rectangle} from "./Rectangle";

export class Line {
    constructor(p0, p1) {
        this.p0 = p0;
        this.p1 = p1;
    }

    isVertical() {
        return this.p0.y === this.p1.y;
    }

    isHorizontal() {
        return this.p0.x === this.p1.x;
    }

    toRectangle(width) {
        if (this.isHorizontal())
            if (this.p0.y < this.p1.y)
                return new Rectangle(...this.p0.getRaw(), width, Math.abs(this.p1.y - this.p0.y));
            else
                return new Rectangle(...this.p1.getRaw(), width, Math.abs(this.p1.y - this.p0.y));
        if (this.isVertical)
            if (this.p0.x < this.p1.x)
                return new Rectangle(...this.p0.getRaw(), Math.abs(this.p1.x - this.p0.x), width);
            else
                return new Rectangle(...this.p1.getRaw(), Math.abs(this.p1.x - this.p0.x), width);
    }


    getRaw() {
        return [this.p0, this.p1];
    }
}
