import { createSuite } from '@/../test/_suite';
import * as Fetch from '@/client/fetch';
import { identity } from '@/utils/functional';

export default createSuite((utils) => ({
  ...utils,

  stubFetch: (methodOrResult, result) => {
    if (result) {
      return utils.stub(Fetch.default, methodOrResult).returns(Promise.resolve(result));
    }

    return utils.stub(Fetch, 'default').returns(Promise.resolve(methodOrResult));
  },

  expectResult: async (promise, mockResult, adapterStub) => {
    if (adapterStub) {
      adapterStub.callsFake(identity);
    }

    const result = await promise();

    if (mockResult) {
      utils.expect(result).to.eql(mockResult);
    }

    if (adapterStub) {
      utils.expect(adapterStub).to.be.calledWithExactly(mockResult);
    }
  },
}));
