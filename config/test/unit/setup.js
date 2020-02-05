import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdomGlobal from 'jsdom-global';
import mockRequire from 'mock-require';
import sinonChai from 'sinon-chai';

// setup browser globals (document, window)

jsdomGlobal();

// chai plugins

chai.use(sinonChai);
chai.use(chaiAsPromised);

// mocks

mockRequire('cuid', () => 'mockID');
mockRequire('redux-persist', { persistReducer: (_, reducer) => reducer });
mockRequire('redux-persist/lib/storage', {});
mockRequire('redux-persist/lib/storage/session', {});
