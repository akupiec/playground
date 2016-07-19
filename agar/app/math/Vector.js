class Vector {
    constructor(v, a, b) {
        this.a = a;
        this.b = b;
        this.v = v || [b[0] - a[0], b[1] - a[1]];
    }

    getMin() {
        if (Math.abs(this.v[0]) < Math.abs(this.v[1])) {
            return new Vector(null, null, [this.v[0], 0]);
        } else {
            return new Vector(null, null, [0, this.v[1]]);
        }
    }

    getHalf() {
        return new Vector(null, null, [this.v[0] / 2, this.v[1] / 2]);
    }

    getNegative() {
        return new Vector(null, null, [-this.v[0], -this.v[1]]);
    }

    getRaw() {
        return this.v;
    }

    getLength() {
        return Math.sqrt(this.v[0] * this.v[0] + this.v[1] * this.v[1]);
    }

    addVal(a, b) {
        this.v[0] += a;
        this.v[1] += b;
    }
}
