import chai from 'chai';
import mochaSuite from 'mocha-suite';
import sinon from 'sinon';

export const createSuite = (createUtils) =>
  mochaSuite((tests) => {
    const sandbox = sinon.createSandbox();

    afterEach(() => sandbox.restore());

    const utils = {
      spy: sandbox.spy.bind(sandbox),
      stub: sandbox.stub.bind(sandbox),
      stubLocalStorage: (getter) => {
        const getItem = sandbox.spy(getter);
        const setItem = sandbox.spy();
        const localStorage = { getItem, setItem };

        sandbox.stub(window, 'localStorage').get(() => localStorage);

        return localStorage;
      },
      mockDate: (ms) => {
        sandbox.stub(Date, 'now').returns(ms);
      },
      expect: chai.expect,
    };

    tests({ ...utils, ...createUtils?.(utils) });
  });

const suite = createSuite();

export default suite;
