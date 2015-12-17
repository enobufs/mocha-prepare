'use strict';

/* Usage:
 *
 *  var prepare = require('mocha-prepare');
 *  prepare(function (done) {
 *      // do some preparation here..
 *      done();
 *  });
 */

function prepare(handler) {
    var Mocha = require('mocha');
    var run = Mocha.prototype.run;

    Mocha.prototype.run = function (done) {
        var self = this;
        handler(function () {
            run.call(self, function () {
                done.apply(this, arguments);
            });
        });
    };
}

module.exports = prepare;
