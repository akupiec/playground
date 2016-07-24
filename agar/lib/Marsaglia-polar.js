module.exports = {
    Gaussian: class {
        constructor(mean = 100, stdDev = 15) {
            this.y2 = null;
            this.use_last = false;
            this.mean = mean;
            this.stdDev = stdDev;
        }

        genNextRandom() {
            return this.gaussian(this.mean, this.stdDev);
        }

        gaussian(mean, stdev) {
            var y1;
            if (this.use_last) {
                y1 = this.y2;
                this.use_last = false;
            }
            else {
                var x1, x2, w;
                do {
                    x1 = 2.0 * Math.random() - 1.0;
                    x2 = 2.0 * Math.random() - 1.0;
                    w = x1 * x1 + x2 * x2;
                } while (w >= 1.0);
                w = Math.sqrt((-2.0 * Math.log(w)) / w);
                y1 = x1 * w;
                this.y2 = x2 * w;
                this.use_last = true;
            }

            var retval = mean + stdev * y1;
            if (retval > 0)
                return retval;
            return -retval;
        }
    },

    simpleRandom: () => {
        var x1, x2, rad;
        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            rad = x1 * x1 + x2 * x2;
        } while (rad >= 1 || rad == 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        return x1 * c;
    },

    getRandomArbitrary: (val, min, max) => {
        return val * (max - min) + min;
    },

    testPolygonRender: () => {
        var graphics = new PIXI.Graphics();

        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 80, 800, 4);
        graphics.endFill();

        graphics.beginFill(0xFF0000);
        var a = [];
        for (let i = 0; i < 100; i++) {
            let sizeW = simpleRandom();
            sizeW = getRandomArbitrary(sizeW, 0, 40);
            a.push(sizeW);
        }
        a.sort((a, b) => b - a);
        for (let i = 0; i < 100; i++) {
            graphics.drawRect(i * 5, 0, 5, Math.abs(a[i]));
        }

        graphics.endFill();
        return graphics;
    },

    testRandomGenerator: () => {
        var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0x1099bb});
        document.body.appendChild(renderer.view);

        var stage = new PIXI.Container();
        var graphics = testPolygonRender();
        stage.addChild(graphics);
        animate();
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(stage);
        }
    }
};
