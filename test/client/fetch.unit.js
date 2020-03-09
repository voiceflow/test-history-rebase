import suite from '@/../test/_suite';
import fetch, { DEFAULT_FETCH_OPTIONS, REQUEST_CACHE } from '@/client/fetch';
import rawFetch from '@/client/fetch/raw';
import * as FetchUtils from '@/client/fetch/utils';
import { generate } from '@/utils/testing';

const TEST_URL = 'test/12345';
const FULL_TEST_URL = `https://undefined/${TEST_URL}`;

suite('fetch', ({ expect, spy, stub, mockDate }) => {
  const mockRequestCache = ({ get = null, set = null, has = null } = {}) => {
    spy(REQUEST_CACHE);

    return {
      verify: () => {
        if (get !== null) {
          expect(REQUEST_CACHE.get).to.have.callCount(get);
        }
        if (set !== null) {
          expect(REQUEST_CACHE.set).to.have.callCount(set);
        }
        if (has !== null) {
          expect(REQUEST_CACHE.has).to.have.callCount(has);
        }
      },
    };
  };

  const stubFetch = () => {
    const fetchCall = stub(FetchUtils, '_fetch');
    const yieldResult = (call, { status = 200, body = '' }) =>
      call.returns(
        Promise.resolve({
          status,
          text: () => Promise.resolve(body),
        })
      );

    return Object.assign(fetchCall, {
      yields: (result = {}, ...nextResults) => {
        if (nextResults.length) {
          yieldResult(fetchCall.onCall(0), result);
          nextResults.forEach((nextResult, index) => yieldResult(fetchCall.onCall(index + 1), nextResult));

          return fetchCall;
        }

        return yieldResult(fetchCall, result);
      },
    });
  };

  describe('rawFetch()', () => {
    beforeEach(() => {
      REQUEST_CACHE.clear();
    });

    it('passes options', async () => {
      const fetchCall = stubFetch().yields();

      await rawFetch(TEST_URL, { foo: 'bar' });

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: {},
        foo: 'bar',
      });
    });

    it('runs', async () => {
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await rawFetch(TEST_URL);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: {},
      });
      expect(response).to.eql(mockResponse);
    });

    it('cache - true', async () => {
      const [mockResponse1, mockResponse2, mockResponse3] = generate.array(3, () => ({ status: generate.number(), body: generate.string() }));
      const fetchCall = stubFetch().yields(mockResponse1, mockResponse2, mockResponse3);
      const cache = mockRequestCache({ has: 6, get: 4, set: 3 });
      const opts = { cache: true, expiry: false };

      const response1 = await rawFetch('a', opts);
      const response2 = await rawFetch('a', opts);
      const response3 = await rawFetch('a', opts);
      expect(fetchCall).to.have.callCount(1);

      const response4 = await rawFetch('a', { ...opts, foo: 'bar' });
      const response5 = await rawFetch('a', { ...opts, foo: 'bar' });
      expect(fetchCall).to.have.callCount(2);

      const response6 = await rawFetch('b', opts);
      expect(fetchCall).to.have.callCount(3);

      cache.verify();

      expect(response1).to.eql(mockResponse1);
      expect(response2).to.eql(mockResponse1);
      expect(response3).to.eql(mockResponse1);

      expect(response4).to.eql(mockResponse2);
      expect(response5).to.eql(mockResponse2);

      expect(response6).to.eql(mockResponse3);
    });

    it('cache - expiry', async () => {
      const [mockResponse1, mockResponse2, mockResponse3] = generate.array(3, () => ({ status: generate.number(), body: generate.string() }));
      const fetchCall = stubFetch().yields(mockResponse1, mockResponse2, mockResponse3);
      const cache = mockRequestCache({ has: 6, get: 4, set: 3 });
      const opts = { cache: true, expiry: 1000 };
      const currentTime = Date.now();
      const date = mockDate(currentTime);

      const response1 = await rawFetch('a', opts);
      const response2 = await rawFetch('a', opts);
      const response3 = await rawFetch('a', opts);
      expect(fetchCall).to.have.callCount(1);

      date.returns(currentTime + 1001);

      const response4 = await rawFetch('a', opts);
      const response5 = await rawFetch('a', opts);
      expect(fetchCall).to.have.callCount(2);

      const response6 = await rawFetch('b', opts);
      expect(fetchCall).to.have.callCount(3);

      cache.verify();

      expect(response1).to.eql(mockResponse1);
      expect(response2).to.eql(mockResponse1);
      expect(response3).to.eql(mockResponse1);

      expect(response4).to.eql(mockResponse2);
      expect(response5).to.eql(mockResponse2);

      expect(response6).to.eql(mockResponse3);
    });

    it('cache - false', async () => {
      const [mockResponse1, mockResponse2, mockResponse3] = generate.array(3, () => ({ status: generate.number(), body: generate.string() }));
      const fetchCall = stubFetch().yields(mockResponse1, mockResponse1, mockResponse1, mockResponse2, mockResponse2, mockResponse3);
      const cache = mockRequestCache({ has: 0, get: 0, set: 0 });

      const response1 = await rawFetch('a');
      const response2 = await rawFetch('a');
      const response3 = await rawFetch('a');
      expect(fetchCall).to.have.callCount(3);

      const response4 = await rawFetch('a', { foo: 'bar' });
      const response5 = await rawFetch('a', { foo: 'bar' });
      expect(fetchCall).to.have.callCount(5);

      const response6 = await rawFetch('b');
      expect(fetchCall).to.have.callCount(6);

      cache.verify();

      expect(response1).to.eql(mockResponse1);
      expect(response2).to.eql(mockResponse1);
      expect(response3).to.eql(mockResponse1);

      expect(response4).to.eql(mockResponse2);
      expect(response5).to.eql(mockResponse2);

      expect(response6).to.eql(mockResponse3);
    });
  });

  describe('CRUD requests', () => {
    it('GET request', async () => {
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await fetch.get(TEST_URL);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: {},
        method: 'GET',
      });
      expect(response).to.eq(mockResponse.body);
    });

    it('POST request', async () => {
      const mockBody = generate.object();
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await fetch.post(TEST_URL, mockBody);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockBody),
      });
      expect(response).to.eq(mockResponse.body);
    });

    it('PUT request', async () => {
      const mockBody = generate.object();
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await fetch.put(TEST_URL, mockBody);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockBody),
      });
      expect(response).to.eq(mockResponse.body);
    });

    it('PATCH request', async () => {
      const mockBody = generate.object();
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await fetch.patch(TEST_URL, mockBody);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(mockBody),
      });
      expect(response).to.eq(mockResponse.body);
    });

    it('DELETE request', async () => {
      const mockBody = generate.object();
      const mockResponse = { status: generate.number(), body: generate.string() };
      const fetchCall = stubFetch().yields(mockResponse);

      const response = await fetch.delete(TEST_URL, mockBody);

      expect(fetchCall).to.be.calledWithExactly(FULL_TEST_URL, {
        ...DEFAULT_FETCH_OPTIONS,
        headers: { 'content-type': 'application/json' },
        method: 'DELETE',
        body: JSON.stringify(mockBody),
      });
      expect(response).to.eq(mockResponse.body);
    });
  });
});
