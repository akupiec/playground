export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getRaw() {
        return [this.x, this.y];
    }
}