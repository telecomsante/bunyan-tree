'use strict';

let stream   = require('stream');
let log      = require('../index');
let childLog = require('../index').fork({component: 'child'});

class TestStream extends stream.Writable {
	constructor() {
		super();
		this.acceptLog = true;
	}

	ensureLog(log) {
		this.acceptLog = true;
		this.referenceLog = log;
	}

	ensureNoLog() {
		this.acceptLog = false;
	}

	_write(chunk, enc, next) {
		if(!this.acceptLog) {
			throw new Error(`does not accept ${chunk.toString()}`);
		}
		if (this.referenceLog) {
			let log = JSON.parse(chunk);
			Object.keys(this.referenceLog).forEach(key => {
				if (log[key] !== this.referenceLog[key]) {
					throw new Error(`received ${JSON.stringify(log)} instead of ${JSON.stringify(this.referenceLog)}`);
				}
			});
		} else {
			console.log(chunk.toString());
		}
		next();
	}
}

let testStream = new TestStream();

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

log.treeLevel('warning');
testStream.ensureNoLog();
log.info('COUCOU');
childLog.info('COUCOU');
