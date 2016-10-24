# The bunyan tree

> For developers, you must comply with the release procedure described in the [changelog](CHANGELOG.md).

A current limitation of bunyan is that one cannot set the level of a logger and all its children at once.

`bunyan-tree` provides this feature at the cost of being a slightly more verbose during log objects declarations.

In fact, `level` is not the only method that can be applied recursively to a whole bunyan tree, recursive versions of all bunyan methods are available in the `tree` attribute of a logger.

## Install

```sh
npm install --save bunyan-tree
```

## Usage

Here is a simple usage example:

main.js:

```javascript
var someModule = require('./someModule');
var log = require('bunyan-tree');

log.seed({ /* bunyan options */});

log.tree.level('warning');

someModule();
```

someModule.js:

```javascript
var log = require('bunyan-tree').fork({/* child options, i.e. component name (component: 'myComponent') */});

log.info('this will be logged');

module.exports = function () {
	log.info('this will not be logged');
};
```
