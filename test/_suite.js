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
      expect: chai.expect,
    };

    tests({ ...utils, ...createUtils?.(utils) });
  });

const suite = createSuite();

export default suite;
