import { SinonStub } from 'sinon';
import { Assign } from 'utility-types';

import { createSuite } from '@/../test/_suite';
import { AnyBidirectionalAdapter, AnyBidirectionalMultiadapter, BidirectionalAdapter } from '@/client/adapters/utils';
import fetch, * as Fetch from '@/client/fetch';
import { identity, noop } from '@/utils/functional';
import { generate } from '@/utils/testing';

type AdapterInput<T> = T extends BidirectionalAdapter<infer R, any, any[], any[]> ? R : never;

type AdapterArguments<T> = T extends BidirectionalAdapter<any, any, infer R, any[]> ? R : never[];

export default createSuite((utils) => ({
  ...utils,

  stubAdapter: <T extends AnyBidirectionalAdapter>(adapter: T, method: keyof T, factory: () => any = generate.object): [any, SinonStub] => {
    const transformed: any = factory();
    const adapterStub = utils.stub(adapter, method).returns(transformed);

    return [transformed, adapterStub];
  },

  stubFetch: (method: keyof typeof fetch = 'get') => {
    const fetchCall = (method ? utils.stub(fetch, method) : utils.stub(Fetch, 'default')).returns(Promise.resolve());
    const fetchAumentation = {
      resolves: <R>(result: R) => fetchCall.returns(Promise.resolve(result)) as SinonStub<Parameters<typeof fetch[typeof method]>, Promise<R>>,
      rejects: <E extends Error>(error: E) =>
        fetchCall.returns(Promise.reject(error)) as SinonStub<Parameters<typeof fetch[typeof method]>, Promise<never>>,
    };

    return Object.assign(fetchCall, fetchAumentation) as Assign<typeof fetchCall, typeof fetchAumentation>;
  },

  expectCall: <T extends any[], R>(method: (...args: T) => Promise<R>, ...args: T) => {
    const createUtils = (runTest: () => void = noop, expectedResult?: any) => ({
      withResponseAdapter: (adapterStub: SinonStub, clientResult: any, ...adapterArgs: any[]) => {
        adapterStub.callsFake(identity);

        return createUtils(() => {
          runTest();

          utils.expect(adapterStub).to.be.calledWithExactly(clientResult, ...adapterArgs);
        }, clientResult);
      },

      withAdapter<A extends AnyBidirectionalAdapter>(adapter: AnyBidirectionalAdapter, input: AdapterInput<A>, ...adapterArgs: AdapterArguments<A>) {
        return this.withResponseAdapter(utils.stub(adapter, 'fromDB'), input, ...adapterArgs);
      },

      withListAdapter<A extends AnyBidirectionalMultiadapter>(adapter: A, input: AdapterInput<A>[], ...adapterArgs: AdapterArguments<A>) {
        return this.withResponseAdapter(utils.stub(adapter, 'mapFromDB'), input, ...adapterArgs);
      },

      toYield: async (finalResult: any = expectedResult) => {
        const result = await method(...args);

        utils.expect(result).to.eql(finalResult);

        runTest();

        return result;
      },

      toThrow: async <E extends Error>(): Promise<E> => {
        try {
          await method(...args);

          utils.expect.fail('expected client to throw an error');
          return new Error('mock error') as E;
        } catch (e) {
          return e;
        }
      },
    });

    return createUtils();
  },
}));
