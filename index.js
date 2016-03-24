'use strict';

var bunyan = require('bunyan');

var bunyanMethods = Object.keys(bunyan.prototype).filter(function (k) {
	return typeof bunyan.prototype[k] === 'function';
});

var bunyanTree = function (options) {
	var that = {};
	var branches = [];
	var trunk;

	that.seed = function (opts) {
		trunk = opts instanceof bunyan ? opts.child(options) : bunyan.createLogger(opts);
		bunyanMethods.forEach(function (m) {
			that[m] = trunk[m].bind(trunk);
		});
		branches.forEach(function (branch) {
			branch.seed(trunk);
		});
		return that;
	};

	that.fork = function (options) {
		var branch = bunyanTree(options);
		if (trunk) { branch.seed(trunk); }
		branches.push(branch);
		return branch;
	};

	that.tree = {};
	bunyanMethods.forEach(function (m) {
		that.tree[m] = function () {
			var args = arguments;
			branches.forEach(function (branch) {
				branch.tree[m].apply(branch, args);
			});
			return trunk[m].apply(trunk, args);
		};
	});

	return that;
};

module.exports = bunyanTree();
