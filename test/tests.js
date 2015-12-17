'use strict';

var assert = require('assert');

console.log('test loaded');

function assertPrep() {
    var complete = global.prepare.complete;
    var startAt = global.prepare.startAt;
    var endAt = global.prepare.endAt;
    assert.ok(complete);
    assert.equal(typeof startAt, 'number');
    assert.equal(typeof endAt, 'number');
    assert.ok(startAt < endAt);
    assert.ok(endAt - startAt > 900);
    assert.ok(endAt - startAt < 1100);
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
        assert(false);
    });
});

