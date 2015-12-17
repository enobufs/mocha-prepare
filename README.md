# mocha-prepare

Add prepare/unprepare async hooks to your Mocha test environment.

## Overview
You may have multiple test cases to run with mocha, and often times, you would
come across situations where you need to do a global setup/teardown processes.
Mocha supports *root level hooks*, but at that point, all of your test files are
loaded (executed). Imagine, the following scenario:

```js
// My test case 1

var foo = require('foo');

describe('test', function () {
    it('test 1', function () {
        assert.equal(foo.getStatus(), 'good');
    });
});

```

The module `foo` provides a method `getStatus()`. But, what if later on, this
foo module chainged its behavior and required an async initialization before
the getStatus() method returns a correct value, and you have already
written hundreds of test cases this way. Modifying all of them to put the
initialization routine inside the root level hook is obviously painful.

This module allows you to set `onPrepare` and `onUnprepare` handlers (takes
callback) that are called right before test cases are loaded and right after
all the tests are complete.

## Installation
```
$ npm install mocha-prepare --save-dev
```

## How to use

### Use require (-r,--require) option
Use *require (-r,--require)* mocha option to set up prepare / unprepare handlers.
Your ./test/mocha.opts should look like this:

```js
--ui bdd
--reporter spec
--timeout 2000
--recursive
--require test/prepare
```

In this example, Mocha will load `./test/propare.js` first. You can implement your
prepare/unprepare handlers in this file.

### Set prepare/unprepare handlers
Your prepare.js file should look like this.

```js
var prepare = require('mocha-prepare');

prepare(function (done) {
    // called before loading of test cases
    someAyncOp(function () {
        done();
    });
}, function (done) {
    // called after all test completes (regardless of errors)
    someAyncOp(function () {
        done();
    });
});
```
> The second (unprepare) hander is optional.

## API

require('mocha-prepare') returns a function that takes `onPrepare` and
`onUnprepare` handlers:

```
module(onPrepare [, onUnprepare])
```
Each handlers takes an argument `done` (with no argument) which will
used in your handlers to tell the module that onPrepare/onUnprepare
has been complete and ready to move on.

## Note
* 'mocha' is specified as a `peerDepenencies`. Make sure to have mocha in your devDependencies.

