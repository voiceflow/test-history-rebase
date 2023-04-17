import * as Fetch from '@ui/utils/fetch';
import createRawFetch from '@ui/utils/fetch/raw';
import { Utils } from '@voiceflow/common';

import suite, { Mocks } from '../_suite';

const TEST_URL = 'test/12345';
const TEST_API_ENDPOINT = 'https://undefined';
const FULL_TEST_URL = `${TEST_API_ENDPOINT}/${TEST_URL}`;

const fetch = Fetch.createFetch(TEST_API_ENDPOINT);

suite('fetch', ({ mocks }) => {
  const mockRequestCache = ({ get = null, set = null, has = null }: Partial<Record<'get' | 'set' | 'has', number | null>> = {}) => {
    const getSpy = vi.spyOn(Fetch.FETCH_REQUEST_CACHE, 'get');
    const setSpy = vi.spyOn(Fetch.FETCH_REQUEST_CACHE, 'set');
    const hasSpy = vi.spyOn(Fetch.FETCH_REQUEST_CACHE, 'has');

    return {
      verify: () => {
        if (get !== null) expect(getSpy).toHaveBeenCalledTimes(get);
        if (set !== null) expect(setSpy).toHaveBeenCalledTimes(set);
        if (has !== null) expect(hasSpy).toHaveBeenCalledTimes(has);
      },
    };
  };

  const generateResponses = (count = 3) =>
    Utils.generate.array<Mocks.FetchTypes.Response>(count, () => ({ status: Utils.generate.number(), body: Utils.generate.string() }));

  describe('creatRawFetch()', () => {
    const testAPIEndpoint = 'https://myEnpoint';
    const fullTestURL = `${testAPIEndpoint}/${TEST_URL}`;
    const rawFetch = createRawFetch(testAPIEndpoint);

    beforeEach(() => Fetch.FETCH_REQUEST_CACHE.clear());

    it('passes options', async () => {
      const fetch = mocks.fetch();

      await rawFetch(TEST_URL, { foo: 'bar' } as any);

      expect(fetch).toHaveBeenCalledWith(fullTestURL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: {},
        foo: 'bar',
      });
    });

    it('runs', async () => {
      const [mockResponse] = generateResponses(1);

      const fetchCall = mocks.fetch(mockResponse);

      const response = await rawFetch(TEST_URL);

      expect(fetchCall).toHaveBeenCalledWith(fullTestURL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: {},
      });
      expect(response).toEqual(mockResponse);
    });

    it('cache - true', async () => {
      const cache = mockRequestCache({ has: 6, get: 4, set: 3 });
      const [mockResponse1, mockResponse2, mockResponse3] = generateResponses();

      const fetchCall = mocks.fetch(mockResponse1, mockResponse2, mockResponse3);

      const opts: Fetch.FetchOptions = { cache: true, expiry: false };

      const response1 = await rawFetch('a', opts);
      const response2 = await rawFetch('a', opts);
      const response3 = await rawFetch('a', opts);

      expect(fetchCall).toHaveBeenCalledTimes(1);

      const response4 = await rawFetch('a', { ...opts, foo: 'bar' } as any);
      const response5 = await rawFetch('a', { ...opts, foo: 'bar' } as any);

      expect(fetchCall).toHaveBeenCalledTimes(2);

      const response6 = await rawFetch('b', opts);

      expect(fetchCall).toHaveBeenCalledTimes(3);

      cache.verify();

      expect(response1).toEqual(mockResponse1);
      expect(response2).toEqual(mockResponse1);
      expect(response3).toEqual(mockResponse1);

      expect(response4).toEqual(mockResponse2);
      expect(response5).toEqual(mockResponse2);

      expect(response6).toEqual(mockResponse3);
    });

    it('cache - expiry', async () => {
      const cache = mockRequestCache({ has: 6, get: 4, set: 3 });
      const [mockResponse1, mockResponse2, mockResponse3] = generateResponses();

      const fetchCall = mocks.fetch(mockResponse1, mockResponse2, mockResponse3);

      const opts = { cache: true, expiry: 1000 };
      const currentTime = Date.now();

      vi.setSystemTime(currentTime);

      const response1 = await rawFetch('a', opts);
      const response2 = await rawFetch('a', opts);
      const response3 = await rawFetch('a', opts);
      expect(fetchCall).toHaveBeenCalledTimes(1);

      vi.setSystemTime(currentTime + 1001);

      const response4 = await rawFetch('a', opts);
      const response5 = await rawFetch('a', opts);
      expect(fetchCall).toHaveBeenCalledTimes(2);

      const response6 = await rawFetch('b', opts);
      expect(fetchCall).toHaveBeenCalledTimes(3);

      cache.verify();

      expect(response1).toEqual(mockResponse1);
      expect(response2).toEqual(mockResponse1);
      expect(response3).toEqual(mockResponse1);

      expect(response4).toEqual(mockResponse2);
      expect(response5).toEqual(mockResponse2);

      expect(response6).toEqual(mockResponse3);
    });

    it('cache - false', async () => {
      const cache = mockRequestCache({ has: 0, get: 0, set: 0 });
      const [mockResponse1, mockResponse2, mockResponse3] = generateResponses();

      const fetchCall = mocks.fetch(mockResponse1, mockResponse1, mockResponse1, mockResponse2, mockResponse2, mockResponse3);

      const response1 = await rawFetch('a');
      const response2 = await rawFetch('a');
      const response3 = await rawFetch('a');
      expect(fetchCall).toHaveBeenCalledTimes(3);

      const response4 = await rawFetch('a', { foo: 'bar' } as any);
      const response5 = await rawFetch('a', { foo: 'bar' } as any);
      expect(fetchCall).toHaveBeenCalledTimes(5);

      const response6 = await rawFetch('b');
      expect(fetchCall).toHaveBeenCalledTimes(6);

      cache.verify();

      expect(response1).toEqual(mockResponse1);
      expect(response2).toEqual(mockResponse1);
      expect(response3).toEqual(mockResponse1);

      expect(response4).toEqual(mockResponse2);
      expect(response5).toEqual(mockResponse2);

      expect(response6).toEqual(mockResponse3);
    });
  });

  describe('CRUD requests', () => {
    it('GET request', async () => {
      const [mockResponse] = generateResponses(1);
      const fetchCall = mocks.fetch(mockResponse);

      const response = await fetch.get(TEST_URL);

      expect(fetchCall).toHaveBeenCalledWith(FULL_TEST_URL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: {},
        method: 'GET',
      });
      expect(response).toEqual(mockResponse.body);
    });

    it('POST request', async () => {
      const mockBody = Utils.generate.object();
      const [mockResponse] = generateResponses(1);
      const fetchCall = mocks.fetch(mockResponse);

      const response = await fetch.post(TEST_URL, mockBody);

      expect(fetchCall).toHaveBeenCalledWith(FULL_TEST_URL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockBody),
      });
      expect(response).toEqual(mockResponse.body);
    });

    it('PUT request', async () => {
      const mockBody = Utils.generate.object();
      const [mockResponse] = generateResponses(1);
      const fetchCall = mocks.fetch(mockResponse);

      const response = await fetch.put(TEST_URL, mockBody);

      expect(fetchCall).toHaveBeenCalledWith(FULL_TEST_URL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockBody),
      });
      expect(response).toEqual(mockResponse.body);
    });

    it('PATCH request', async () => {
      const mockBody = Utils.generate.object();
      const [mockResponse] = generateResponses(1);
      const fetchCall = mocks.fetch(mockResponse);

      const response = await fetch.patch(TEST_URL, mockBody);

      expect(fetchCall).toHaveBeenCalledWith(FULL_TEST_URL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(mockBody),
      });
      expect(response).toEqual(mockResponse.body);
    });

    it('DELETE request', async () => {
      const mockBody = Utils.generate.object();
      const [mockResponse] = generateResponses(1);
      const fetchCall = mocks.fetch(mockResponse);

      const response = await fetch.delete(TEST_URL, mockBody);

      expect(fetchCall).toHaveBeenCalledWith(FULL_TEST_URL, {
        ...Fetch.DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'DELETE',
        body: JSON.stringify(mockBody),
      });
      expect(response).toEqual(mockResponse.body);
    });
  });
});
