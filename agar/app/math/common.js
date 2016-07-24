module.exports = {
    randomPointInCircle: (radius) => {
        let t = 2 * Math.PI * Math.random();
        let u = Math.random() + Math.random();
        let r = null;
        if (u > 1) {
            r = 2 - u
        } else {
            r = u;
        }
        const x = radius * r * Math.cos(t);
        const y = radius * r * Math.sin(t);
        return {x, y};
    },

    distanceBetweenPoints: (a, b) => {
        const dX = (a.x - b.x);
        const dY = (a.y - b.y);
        return Math.sqrt(dX * dX + dY * dY);
    },
    normalizeRandomRange: (val, min, max) => {
        return val * (max - min) + min;
    }
};
