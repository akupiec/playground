export class Line {
    constructor(p0, p1) {
        this.p0 = p0;
        this.p1 = p1;
    }

    getRaw() {
        return [this.p0, this.p1];
    }
}
