import { SinonStub } from 'sinon';

import suite from '@/../test/_suite';
import { api, apiV2 } from '@/client/fetch';

type MockResult = { status?: number; body?: string };

const TEST_API_ENDPOINT = 'https://undefined';

suite('fetch', ({ expect, stub }) => {
  const stubFetch = () => {
    const fetchCall = stub(global, 'fetch');

    const yieldResult = (call: SinonStub, { status = 200, body = '' }: MockResult) =>
      call.returns(
        Promise.resolve({
          status,
          text: () => Promise.resolve(body),
        })
      );

    return Object.assign(fetchCall, {
      yields: (result: MockResult = {}, ...nextResults: MockResult[]) => {
        if (nextResults.length) {
          yieldResult(fetchCall.onCall(0), result);
          nextResults.forEach((nextResult, index) => yieldResult(fetchCall.onCall(index + 1), nextResult));

          return fetchCall;
        }

        return yieldResult(fetchCall, result);
      },
    });
  };

  describe('api', () => {
    it('has endpoint prefix', async () => {
      const fetchCall = stubFetch().yields();

      await api('some/path');

      expect(fetchCall).to.be.calledWith(`${TEST_API_ENDPOINT}/some/path`);
    });
  });

  describe('apiV2', () => {
    it('has endpoint prefix', async () => {
      const fetchCall = stubFetch().yields();

      await apiV2('some/path');

      expect(fetchCall).to.be.calledWith(`${TEST_API_ENDPOINT}/v2/some/path`);
    });
  });
});
