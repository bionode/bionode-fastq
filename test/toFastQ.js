'use strict';
var should = require('chai').should();
var fastq = require('../index');


describe('toFastQ', function () {

    this.timeout(3000);
    var output = [];

    it('should run without error', function (done) {
        var applyToEach = function (item) {
            output.push(item);
        };
        var onEnd = function (err) {
            if (err) {
                return done(err);
            }
            return done();
        };
        fastq.toFastQ('test/data/sample.fq', applyToEach, onEnd);
    });

    it('should process 750000 objects', function (done) {
        output.length.should.equal(750000);
        done();
    });
});