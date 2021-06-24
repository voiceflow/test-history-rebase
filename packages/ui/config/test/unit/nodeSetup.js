const jsdomGlobal = require('jsdom-global');

// setup browser globals (document, window)

jsdomGlobal();

// setup test utilities

require('./setup');
