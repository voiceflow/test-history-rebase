import chai from 'chai';
import mochaSuite from 'mocha-suite';
import rewiremock from 'rewiremock';
import sinon, { SinonMockStatic, SinonSpyStatic, SinonStub, SinonStubStatic } from 'sinon';

export type Utils = {
  spy: SinonSpyStatic;
  stub: SinonStubStatic;
  mock: SinonMockStatic;
  expect: typeof chai.expect;
  rewire: typeof rewiremock;
  mockDate: (ms: number) => SinonStub;
  stubLocalStorage: (getter?: (key: string) => string) => { getItem: (key: string) => string; setItem: (key: string, value: string) => void };
};

export const createSuite = <T = {}>(createUtils?: (utils: Utils) => T) =>
  mochaSuite<T & Utils, void>((tests) => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
      global.localStorage.clear();
    });

    const utils: Utils = {
      spy: sandbox.spy.bind(sandbox),
      stub: sandbox.stub.bind(sandbox),
      mock: sandbox.mock.bind(sandbox),
      expect: chai.expect,
      rewire: rewiremock,
      mockDate: (ms: number) => sandbox.stub(Date, 'now').returns(ms),
      stubLocalStorage: (getter?: (key: string) => string) => {
        const getItem = getter ? sandbox.spy(getter) : sandbox.spy();
        const setItem = sandbox.spy();
        const localStorage = { getItem, setItem };

        sandbox.stub(window, 'localStorage').get(() => localStorage);

        return localStorage;
      },
    };

    tests({ ...utils, ...createUtils?.(utils) } as T & Utils);
  });

const suite = createSuite();

export default suite;
