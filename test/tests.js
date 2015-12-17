'use strict';

var assert = require('assert');

console.log('test loaded');

function assertPrep() {
    var prepared = global.prep.prepared;
    var startAt = global.prep.startAt;
    var endAt = global.prep.endAt;
    var DELAY_MIN = global.prep.DELAY - global.prep.MARGIN;
    var DELAY_MAX = global.prep.DELAY + global.prep.MARGIN;
    assert.ok(prepared);
    assert.equal(typeof startAt, 'number');
    assert.equal(typeof endAt, 'number');
    assert.ok(startAt < endAt);
    assert.ok(endAt - startAt > DELAY_MIN);
    assert.ok(endAt - startAt < DELAY_MAX);
    assert.ok(endAt < Date.now());
}

before(function () {
    assertPrep();
});

after(function () {
    console.log('GLOBAL AFTER');
});

describe('mocha-prepare tests', function () {
    it('should be prepared by now', function () {
        assertPrep();
    });
});

