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
	};

	that.fork = function (options) {
		var branch = bunyanTree(options);
		if (trunk) { branch.seed(trunk); }
		branches.push(branch);
		return branch;
	};

	that.treeLevel = function (level) {
		trunk.level(level);
		branches.forEach(branch => branch.treeLevel(level));
	};

	return that;
};

module.exports = bunyanTree();
