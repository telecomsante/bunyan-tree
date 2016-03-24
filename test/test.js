'use strict';

var stream   = require('stream');
var util     = require('util');
var log      = require('../index');
var childLog = require('../index').fork({ component: 'child' });

var TestStream = function () {
	stream.Writable.call(this);
	this.acceptLog = true;
};

util.inherits(TestStream, stream.Writable);

TestStream.prototype.ensureLog = function (log) {
	this.acceptLog = true;
	this.referenceLog = log;
};

TestStream.prototype.ensureNoLog = function () {
	this.acceptLog = false;
};

TestStream.prototype._write = function (chunk, enc, next) {
	if (!this.acceptLog) {
		throw new Error('does not accept ' + chunk.toString());
	}
	if (this.referenceLog) {
		var log = JSON.parse(chunk);
		Object.keys(this.referenceLog).forEach(function (key) {
			if (log[key] !== this.referenceLog[key]) {
				throw new Error('received ' + JSON.stringify(log) + ' instead of ' + JSON.stringify(this.referenceLog));
			}
		}.bind(this));
	} else {
		console.log(chunk.toString());
	}
	next();
};

var testStream = new TestStream();

log.seed({
	name: 'TEST',
	streams: [
		{
			stream: testStream,
			level: 'debug'
		}
	]
});

testStream.ensureLog({
	msg: 'COUCOU'
});
log.info('COUCOU');
childLog.info('COUCOU');

log.tree.level('warn');
testStream.ensureNoLog();
log.info('COUCOU');
childLog.info('COUCOU');
