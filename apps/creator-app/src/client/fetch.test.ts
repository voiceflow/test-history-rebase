import { describe, expect, it } from 'vitest';

import { api, apiV2 } from '@/client/fetch';

const TEST_API_ENDPOINT = 'https://localhost:8003';

describe('fetch', ({ mocks }) => {
  describe('api', () => {
    it('has endpoint prefix', async () => {
      const fetchCall = mocks.fetch();

      await api('some/path');

      expect(fetchCall).toBeCalledWith(`${TEST_API_ENDPOINT}/some/path`, {
        credentials: 'include',
        headers: {},
        mode: 'cors',
      });
    });
  });

  describe('apiV2', () => {
    it('has endpoint prefix', async () => {
      const fetchCall = mocks.fetch();

      await apiV2('some/path');

      expect(fetchCall).toBeCalledWith(`${TEST_API_ENDPOINT}/v2/some/path`, {
        credentials: 'include',
        headers: {},
        mode: 'cors',
      });
    });
  });
});
