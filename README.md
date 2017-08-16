# mocha-prepare

Add prepare/unprepare async hooks to your Mocha test environment.

## Overview
You may have multiple test cases to run with mocha, and often times, you would
come across situations where you need to do a global setup/teardown processes.
Mocha supports *root level hooks*, but at that point, all of your test files are
loaded, meaning, all of your code outside describe() or other mocha's global
functions are all executed.

Imagine, the following scenario:

```js
// My test case 1

var foo = require('foo'); // called even before the root level handler `before`

describe('test', function () {
    it('test 1', function () {
        assert.equal(foo.getStatus(), 'good');
    });
});

```

The module `foo` provides a method `getStatus()`. But, what if later on, this
foo module chainged its behavior and required an async initialization before
the getStatus() method returns a correct value, and you have already
written hundreds of test cases this way?

```js
// somewhere, we need to do...
var foo = require('foo');
foo.use(require('foo-plugin-a');
foo.use(require('foo-plugin-b');
foo.init(function () {
    // now the module 'foo' is ready to use.
});

```
Where can we put the above code? You can put it in your root level `before`
handler, however, modifying all of your existing test cases  to put the
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

In this example, Mocha will load `./test/prepare.js` first. You can implement your
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
Each handlers takes an argument `done` which will be
used in your handlers to tell the module that onPrepare/onUnprepare
has been complete and ready to move on.

The onPrepare handler's callback (done) may optionally take one argument
(err) to indicate the preparation was failed, in which case, the process
will exit immediately with exit code 1. If the value passed to `done` is
an instance of Error, it will print the error stack.

```js
var prepare = require('mocha-prepare');

prepare(function (done) {
    // called before loading of test cases
    someAyncOp(function (err) {
        if (err) {
            done(err);
            return;
        }
        :
        done();
    });
});
```
> The onUnprepare handler's callback does not take any argument.

## Note
* 'mocha' is specified as its `peerDepenencies`. Make sure to have mocha in your devDependencies.

