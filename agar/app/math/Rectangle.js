export class Rectangle {
    constructor(x, y, width, height) {
        console.assert(width > 0);
        console.assert(height > 0);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this._calculateRightAndBottom();
    }

    _calculateRightAndBottom() {
        this._right = this.x + this.width;
        this._bottom = this.y + this.height;
    }

    getLeft() {
        return this.x;
    }

    getRight() {
        return this._right;
    }

    getTop() {
        return this.y;
    }

    getBottom() {
        return this._bottom;
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }

    snapToGrid() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        this._calculateRightAndBottom();
    }

    overlaps(B, minSeparation = 0) {
        const A = this;
        return !(B.getLeft() - minSeparation >= A.getRight() ||
        B.getRight() <= A.getLeft() - minSeparation ||
        B.getBottom() <= A.getTop() - minSeparation ||
        B.getTop() - minSeparation >= A.getBottom());
    }

    overlapsFloor(B, minSeparation = 0) {
        const A = this;
        return !(Math.floor(B.getLeft()) - minSeparation >= Math.floor(A.getRight()) ||
        Math.floor(B.getRight()) <= Math.floor(A.getLeft()) - minSeparation ||
        Math.floor(B.getBottom()) <= Math.floor(A.getTop()) - minSeparation ||
        Math.floor(B.getTop()) - minSeparation >= Math.floor(A.getBottom()));
    }

    minSeparationVector(B, minSeparation) {
        var vect = this.separationVector(B, minSeparation);
        if (Math.abs(vect.x) < Math.abs(vect.y)) {
            vect.y = 0;
        } else {
            vect.x = 0;
        }
        return vect;
    }

    separationVector(B, padding) {
        const A = this;
        const dx = Math.min(Math.floor(A.getRight()) - Math.floor(B.getLeft()) + padding, Math.floor(A.getLeft()) - Math.floor(B.getRight()) - padding);
        const dy = Math.min(Math.floor(A.getTop()) - Math.floor(B.getBottom()) - padding, Math.floor(A.getBottom()) - Math.floor(B.getTop()) - padding);
        return {x: dx, y: dy};
    }

    move(x, y) {
        this._right += x;
        this.x += x;

        this._bottom += y;
        this.y += y;
    }
}