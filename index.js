'use strict';

var bunyan = require('bunyan');

var bunyanMethods = Object.keys(bunyan.prototype).filter(k => typeof bunyan.prototype[k] === 'function');

var bunyanTree = function (options) {
	var that = {};
	var branches = [];
	var trunk;

	that.seed = function (opts) {
		trunk = opts instanceof bunyan ? opts.child(options) : bunyan.createLogger(opts);
		bunyanMethods.forEach(m => that[m] = function () {
			return trunk[m].apply(trunk, arguments);
		});
		branches.forEach(branch => branch.seed(trunk));
		return that;
	};

	that.fork = function (options) {
		var branch = bunyanTree(options);
		if (trunk) { branch.seed(trunk); }
		branches.push(branch);
		return branch;
	};

	that.tree = {};
	bunyanMethods.forEach(m => {
		that.tree[m] = function () {
			trunk[m].apply(trunk, arguments);
			branches.forEach(branch => branch.tree[m].apply(branch, arguments));
		};
	});

	return that;
};

module.exports = bunyanTree();
