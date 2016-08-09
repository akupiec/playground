export class MapData {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.data = new Array(w * h).fill(0);
    }

    getIndex(x, y) {
        return x + this.width * y;
    }

    setVal(x, y, value) {
        this.data[this.getIndex(x, y)] = value;
    }

    getVal(x, y) {
        return this.data[this.getIndex(x, y)];
    }

    getRawData() {
        return this.data;
    }

    getCVS() {
        let data = '';
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                data += this.getVal(x, y);
                if (x < this.width - 1) {
                    data += ',';
                }
            }
            if (y < this.height - 1) {
                data += "\n";
            }
        }
        return data;
    }

}