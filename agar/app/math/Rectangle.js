export class Rectangle {
    constructor(x, y, width, height) {
        console.assert(width > 0);
        console.assert(height > 0);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._right = x + width;
        this._top = y + height;
    }

    getLeft() {
        return Math.floor(this.x);
    }

    getRight() {
        return Math.floor(this._right);
    }

    getTop() {
        return Math.floor(this._top);
    }

    getBottom() {
        return Math.floor(this.y);
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }

    //TODO: unknown licence - analyze and rewrite
    overlaps(B, padding = 0) {
        const A = this;
        return !(B.getLeft() - padding >= A.getRight() ||
        B.getRight() <= A.getLeft() - padding ||
        B.getTop() <= A.getBottom() - padding ||
        B.getBottom() - padding >= A.getTop());
    }

    //TODO: unknown licence - analyze and rewrite
    separationVector(B, padding) {
        let A = this;
        let dx = Math.min(A.getRight() - B.getLeft() + padding, A.getLeft() - B.getRight() - padding);
        let dy = Math.min(A.getBottom() - B.getTop() - padding, A.getTop() - B.getBottom() - padding);
        if (Math.abs(dx) < Math.abs(dy)) {
            return {x: dx, y: 0};
        }
        else {
            return {x: 0, y: dy};
        }
    }

    move(x, y) {
        this._right += x;
        this.x += x;

        this._top += y;
        this.y += y;
    }
}
