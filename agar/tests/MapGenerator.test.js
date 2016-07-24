var assert = require('chai').assert;
var MapGenerator = require('../app/MapGenerator');
var Rectangle = require('../app/math/Rectangle');
var Line = require('../app/math/Line');
var Point = require('../app/math/Point');

describe('MapGenerator', function () {
    var generator;
    beforeEach(function () {
        generator = new MapGenerator();
    });
    afterEach(function () {
        generator = null;
    });

    it('should draw corridor horizontal', function () {
        var A, B, line, lines;
        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(50, 5, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 1);
        line = lines[0];
        assert.instanceOf(line, Line);
        assert.isDefined(line.p0, 'Empty Line');
        assert.isDefined(line.p1, 'Empty Line');
        assert.equal(line.p0.x, 10);
        assert.equal(line.p1.x, 50);
        assert.equal(line.p0.y, line.p1.y);
        assert.isAbove(line.p0.y, 5);
        assert.isBelow(line.p0.y, 10);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(-50, 5, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 1);
        line = lines[0];
        assert.instanceOf(line, Line);
        assert.isDefined(line.p0, 'Empty Line');
        assert.isDefined(line.p1, 'Empty Line');
        assert.equal(line.p0.x, -40);
        assert.equal(line.p1.x, 0);
        assert.equal(line.p0.y, line.p1.y);
        assert.isAbove(line.p0.y, 5);
        assert.isBelow(line.p0.y, 10);


        A = new Rectangle(0, 0, 100, 100);
        B = new Rectangle(-486, 50, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 1);
        line = lines[0];
        assert.instanceOf(line, Line);
        assert.isDefined(line.p0, 'Empty Line');
        assert.isDefined(line.p1, 'Empty Line');
        assert.equal(line.p0.x, -476);
        assert.equal(line.p1.x, 0);
        assert.equal(line.p0.y, line.p1.y);
        assert.isAbove(line.p0.y, 50);
        assert.isBelow(line.p0.y, 100);


        A = new Rectangle(445, -8, 100, 100);
        B = new Rectangle(-486, 50, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 1);
        line = lines[0];
        assert.instanceOf(line, Line);
        assert.isDefined(line.p0, 'Empty Line');
        assert.isDefined(line.p1, 'Empty Line');
        assert.equal(line.p0.x, -476);
        assert.equal(line.p1.x, 445);
        assert.equal(line.p0.y, line.p1.y);
        assert.isAbove(line.p0.y, 50);
        assert.isBelow(line.p0.y, 100);
    });

    it('should draw corridor vertically', function () {
        var A, B, line, lines;
        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(5, 800, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 1);
        line = lines[0];
        assert.instanceOf(line, Line);
        assert.isDefined(line.p0, 'Empty Line');
        assert.isDefined(line.p1, 'Empty Line');
        assert.equal(line.p0.y, 10);
        assert.equal(line.p1.y, 800);
        assert.equal(line.p0.x, line.p1.x);
        assert.isAbove(line.p0.x, 5);
        assert.isBelow(line.p0.x, 10);
    });

    it('should draw L corridor', function () {
        var A, B, line1, line2, lines;
        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(50, 50, 10, 10);
        lines = MapGenerator.connectRects(A, B);
        assert.equal(lines.length, 2);
        line1 = lines[0];
        assert.instanceOf(line1, Line);
        assert.isDefined(line1.p0, 'Empty Line');
        assert.isDefined(line1.p1, 'Empty Line');

        assert.equal(line1.p0.y, line1.p1.y);
        assert.isAbove(line1.p0.y, A.y);
        assert.isBelow(line1.p0.y, A.getBottom());

        assert.equal(line1.p0.x, A.getRight());

        assert.equal(line2.p0.x, line2.p1.x);
        assert.isAbove(line2.p0.x, B.x);
        assert.isBelow(line2.p0.x, B.getRight());
        assert.equal(line1.p0.y, B.x);
    });


    it('should connect horizontally', function () {
        var A, B, isConnected;
        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(50, 5, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(50, -8, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(-457.4, -8.9, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(100, 48.5, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isFalse(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(100, 0, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(0, 100, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isFalse(isConnected);

        A = new Rectangle(0, 0, 100, 100);
        B = new Rectangle(-486.555, 50, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(445, -8, 100, 100);
        B = new Rectangle(-486, 50, 10, 10);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);


        A = new Rectangle(421, 775, 49, 62);
        B = new Rectangle(364, 771, 46, 69);
        isConnected = MapGenerator.connectibleHorizontally(A, B);
        assert.isTrue(isConnected);

    });

    it('should connect vertically', function () {
        var A, B, isConnected;
        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(5, 50, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(-8, 50, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(-8.9, -445, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(48.4, 100, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isFalse(isConnected);

        A = new Rectangle(0, 0, 10, 10);
        B = new Rectangle(0, 100, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(0, 0, 100, 100);
        B = new Rectangle(50, -74.6, 10, 10);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);

        A = new Rectangle(364, 771, 46, 69);
        B = new Rectangle(357, 715, 54, 46);
        isConnected = MapGenerator.connectibleVertically(A, B);
        assert.isTrue(isConnected);
    });

    it('should connect vertically within offset', function () {
        var A, B, isConnected;
        A = new Rectangle(539, 386, 56, 65);
        B = new Rectangle(593, 715, 54, 59);
        isConnected = MapGenerator.connectibleVertically(A, B, 7);
        assert.isFalse(isConnected);

        A = new Rectangle(500, 456, 64, 43);
        B = new Rectangle(627, 462, 47, 69);
        isConnected = MapGenerator.connectibleVertically(A, B, 7);
        assert.isFalse(isConnected);
    });

    it('should connect horizontally within offset', function () {
        var A, B, isConnected;
        A = new Rectangle(539, 386, 56, 65);
        B = new Rectangle(593, 715, 54, 59);
        isConnected = MapGenerator.connectibleHorizontally(A, B, 7);
        assert.isFalse(isConnected);

        A = new Rectangle(500, 456, 64, 43);
        B = new Rectangle(627, 462, 47, 69);
        isConnected = MapGenerator.connectibleHorizontally(A, B, 7);
        assert.isTrue(isConnected);
    });
});