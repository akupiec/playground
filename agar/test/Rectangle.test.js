var assert = require('chai').assert;
import {Rectangle} from "../app/math/Rectangle";


describe('Rectangle', function () {
    it('should getTop', function () {
        var A;
        A = new Rectangle(0, 0, 10, 10);
        assert.equal(A.getTop(), 0);
        A = new Rectangle(-12, -344, 10, 10);
        assert.equal(A.getTop(), -344);
        A = new Rectangle(-12, 344, 10, 10);
        assert.equal(A.getTop(), 344);
        // A = new Rectangle(-12, 1.572, 10, 10);
        // assert.equal(A.getTop(), 1.572);
    });
    it('should getBottom', function () {
        var A;
        A = new Rectangle(0, 0, 10, 10);
        assert.equal(A.getBottom(), 10);
        A = new Rectangle(-12, -344, 10, 10);
        assert.equal(A.getBottom(), -334);
        A = new Rectangle(-12, 344, 10, 10);
        assert.equal(A.getBottom(), 354);
        // A = new Rectangle(-12, 1.572, 10, 10);
        // assert.equal(A.getBottom(), 11.572);
    });
});