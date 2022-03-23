const jsdomGlobal = require('jsdom-global');
const mockRequire = require('mock-require');

// setup browser globals (document, window)

jsdomGlobal();

// setup test utilities

require('./setup');

// mocks

mockRequire('redux-persist', { persistReducer: (_, reducer) => reducer });
mockRequire('redux-persist/lib/storage', {});
mockRequire('redux-persist/lib/storage/session', {});

// logux

class MockLoguxClient {}

mockRequire('@logux/client', { Client: MockLoguxClient });
mockRequire('@logux/client/react', {});
mockRequire('@logux/redux', {});
mockRequire('@logux/core', {});
mockRequire('nanoevents', {});
