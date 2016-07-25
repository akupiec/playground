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
        var centralPoint = new Point(A.x, A.y);
        var a = new Point(rect.x, rect.y);
        var b = new Point(rect.getRight(), rect.y);
        var c = new Point(rect.getRight(), rect.getBottom());
        var d = new Point(rect.x, rect.getBottom());
        const dist = MyMath.distanceBetweenPoints(centralPoint, a);
        const dist2 = MyMath.distanceBetweenPoints(centralPoint, b);
        const dist3 = MyMath.distanceBetweenPoints(centralPoint, c);
        const dist4 = MyMath.distanceBetweenPoints(centralPoint, d);
        return dist < this.r && dist2 < this.r && dist3 < this.r && dist4 < this.r;
    }

    getRaw() {
        return [this.x, this.y, this.r];
    }
}

module.exports = Circle;