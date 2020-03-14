import { createSuite } from '@/../test/_suite';
import fetch, * as Fetch from '@/client/fetch';
import { identity, noop } from '@/utils/functional';

export default createSuite((utils) => ({
  ...utils,

  stubFetch: (method = 'get') => {
    const fetchCall = method ? utils.stub(fetch, method) : utils.stub(Fetch, 'default');

    return Object.assign(fetchCall, {
      yields: (result) => fetchCall.returns(Promise.resolve(result)),
    });
  },

  expectCall: (method, ...args) => {
    const createUtils = (runTest = noop) => ({
      withAdapter: (adapterStub) => {
        adapterStub.callsFake(identity);

        return createUtils((expectedResult) => {
          runTest(expectedResult);

          utils.expect(adapterStub).to.be.calledWithExactly(expectedResult);
        });
      },

      toYield: async (expectedResult) => {
        const result = await method(...args);

        utils.expect(result).to.eql(expectedResult);

        runTest(expectedResult);
      },
    });

    return createUtils();
  },
}));
