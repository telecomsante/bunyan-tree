# The bunyan tree

A current limitation of bunyan is that one cannot set the level of a logger and all its children at once.

`bunyan-tree` provides this feature at the cost of being a slightly more verbose during log objects declarations.

Here is a simple usage example:

main.js:

```javascript
var someModule = require('./someModule');
var log = require('bunyan-tree');

log.seed({ /* bunyan options */});

log.treeLevel('warning');

someModule();
```

someModule.js:

```javascript
var log = require('bunyan-tree').fork({/* child options, i.e. component name */});

log.info('this will be logged');

module.exports = function () {
	log.info('this will not be logged');
};
```
