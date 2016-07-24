var Point = require('./Point');
var MyMath = require('./common');

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    rectInside(rect) {
        const A = this;
        var a = new Point(A.x, A.y);
        var b = new Point(rect.x, rect.y);
        const dist = MyMath.distanceBetweenPoints(a, b);
        return dist < this.r;
    }

    getRaw() {
        return [this.x, this.y, this.r];
    }
}

module.exports = Circle;