class Rectangle {
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
        return Math.floor(this.x);
    }

    getRight() {
        return Math.floor(this._right);
    }

    getTop() {
        return Math.floor(this.y);
    }

    getBottom() {
        return Math.floor(this._bottom);
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

    //TODO: unknown licence - analyze and rewrite
    minSeparationVector(B, minSeparation) {
        var vect = this.separationVector(B, minSeparation);
        if (Math.abs(vect.x) < Math.abs(vect.y)) {
            vect.y = 0;
        }
        else {
            vect.x = 0;
        }
        return vect;
    }

    separationVector(B, padding) {
        let A = this;
        let dx = Math.min(A.getRight() - B.getLeft() + padding, A.getLeft() - B.getRight() - padding);
        let dy = Math.min(A.getTop() - B.getBottom() - padding, A.getBottom() - B.getTop() - padding);
        return {x: dx, y: dy};
    }

    move(x, y) {
        this._right += x;
        this.x += x;

        this._bottom += y;
        this.y += y;
    }
}

module.exports = Rectangle;