'use strict';

var prepare = require('..');
var fs = require('fs');

var FILENAME = 'result.json';

global.prep = {
    DELAY: 500,
    MARGIN: 100,
    prepared: false,
    startAt: Date.now()
};

prepare(function (done) {
    console.log('prepare ...');
    fs.unlink(FILENAME, function () {
        setTimeout(function () {
            console.log('done!');
            global.prep.prepared = true;
            global.prep.endAt = Date.now();
            done();
        }, global.prep.DELAY);
    });
}, function (done) {
    console.log('unprepare ...');
    setTimeout(function () {
        console.log('done!');
        fs.writeFile(FILENAME, JSON.stringify({success:true}), function () {
            done();
        });
    }, global.prep.DELAY);
});

