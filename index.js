'use strict';

function prepare(onPrepare, onUnprepare) {
    // Monkey-patch run method
    var Mocha = require('mocha');
    var run = Mocha.prototype.run;

    Mocha.prototype.run = function (done) {
        var self = this;
        // Call onPrepare() before the actual run().
        onPrepare(function () {
            // Call the actual run().
            run.call(self, function () {
                // All test complete with a result code.
                // Pass forward the arugments for possible spec change
                // in the future.
                var thisArg = this;
                console.log('DONE');
                /* istanbul ignore else */
                if (typeof onUnprepare === 'function') {
                    // onUnprepare() is supplied. Call it.
                    var args = arguments;
                    onUnprepare(function () {
                        // Done.
                        done.apply(thisArg, args);
                    });
                } else {
                    // Done.
                    done.apply(thisArg, arguments);
                }
            });
        });
    };
}

module.exports = prepare;
