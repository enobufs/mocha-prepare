'use strict';

var prepare = require('..');

global.prepare = {
    complete: false,
    startAt: Date.now()
};

prepare(function (done) {
    setTimeout(function () {
        global.prepare.complete = true;
        global.prepare.endAt = Date.now();
        done();
    }, 1000);
});

