'use strict';

var assert = require('assert');

describe('mocha-prepare unit test', function () {
    var Mocha = require('mocha');
    var prepare = require('..');
    var sinon = require('sinon');
    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Successful onPrepare and onUnprepare', function (done) {
        var prepCalled = false;
        var unprepCalled = false;
        var stubRun = sandbox.stub(Mocha.prototype, 'run').callsFake(function (fn) {
            fn();
        });

        prepare(function (donePrep) {
            prepCalled = true;
            donePrep();
        }, function (doneUnprep) {
            unprepCalled = true;
            doneUnprep();
        });

        var mocha = new Mocha();
        mocha.run(function () {
            assert.ok(stubRun.calledOnce);
            assert.ok(prepCalled);
            assert.ok(unprepCalled);
            done();
        });
    });

    it('onPrepare only should succeed', function (done) {
        var prepCalled = false;
        var stubRun = sandbox.stub(Mocha.prototype, 'run').callsFake(function (fn) {
            fn();
        });

        prepare(function (donePrep) {
            prepCalled = true;
            donePrep();
        });

        var mocha = new Mocha();
        mocha.run(function () {
            assert.ok(stubRun.calledOnce);
            assert.ok(prepCalled);
            done();
        });
    });

    it('onPrepare failure with Error object', function (done) {
        var spyPrep = sinon.spy();;
        var unprepCalled = false;
        var stubRun = sandbox.stub(Mocha.prototype, 'run').callsFake(function (fn) {
            fn();
        });
        var stubExit = sandbox.stub(process, 'exit');

        prepare(function (donePrep) {
            donePrep(new Error('fake error'));
        }, function (doneUnprep) {
            unprepCalled = true;
            doneUnprep();
        });

        var mocha = new Mocha();
        mocha.run(function () {
            assert.equal(stubRun.callCount, 0);
            assert.ok(!unprepCalled);
            assert.ok(stubExit.calledOnce);
            done();
        });
    });

    it('onPrepare failure with non-Error oject', function (done) {
        var spyPrep = sinon.spy();;
        var unprepCalled = false;
        var stubRun = sandbox.stub(Mocha.prototype, 'run').callsFake(function (fn) {
            fn();
        });
        var stubExit = sandbox.stub(process, 'exit');

        prepare(function (donePrep) {
            donePrep('fake error');
        }, function (doneUnprep) {
            unprepCalled = true;
            doneUnprep();
        });

        var mocha = new Mocha();
        mocha.run(function () {
            assert.equal(stubRun.callCount, 0);
            assert.ok(!unprepCalled);
            assert.ok(stubExit.calledOnce);
            assert.equal(stubExit.args[0], 1);
            done();
        });
    });
});

