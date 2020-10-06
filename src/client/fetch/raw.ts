import hash from 'object-hash';

import { API_ENDPOINT, DEBUG_HTTP } from '@/config';

import { DEFAULT_CACHE_TIMEOUT, GLOBAL_HEADERS, MAX_CACHE_SIZE, Method, NetworkError, REQUEST_CACHE, StatusCode } from './constants';
import { FetchOptions, FetchResult } from './types';
import { _fetch, buildOptions, debugRequest, log, parseResponseBody } from './utils';

let unauthorizedHandler: (endpoint: string) => void;

export const setUnauthorizedHandler = (handler: (endpoint: string) => void) => {
  unauthorizedHandler = handler;
};

async function rawFetch<R>(
  url: string,
  { body, json = true, cache = false, expiry = DEFAULT_CACHE_TIMEOUT, unauthorizedInterceptor = true, ...rawOpts }: FetchOptions = {}
): Promise<FetchResult<R>> {
  const opts = buildOptions(rawOpts, GLOBAL_HEADERS, body, json);

  const finalURL = `${API_ENDPOINT}/${url}`;

  if (cache && REQUEST_CACHE.has(finalURL)) {
    const cacheData = REQUEST_CACHE.get(finalURL);
    const isValidCache = !expiry || Date.now() - cacheData.timestamp < expiry;

    if (cacheData.hash === hash(opts) && isValidCache) {
      return cacheData.response;
    }
  }

  const res = await _fetch(finalURL, opts);

  const resText = await res.text();
  const resSize = resText.length;
  const resBody = parseResponseBody<R>(resText, json);

  if (unauthorizedInterceptor && res.status === StatusCode.UNAUTHORIZED) {
    await unauthorizedHandler?.(API_ENDPOINT);
  }

  if (res.status >= StatusCode.BAD_REQUEST) {
    log.error(log.bold(opts.method || Method.GET), log.value(finalURL));
    throw new NetworkError<R>(res.status, res.statusText, resBody);
  } else if (DEBUG_HTTP) {
    debugRequest(finalURL, opts, body);
  }

  const response = {
    status: res.status,
    body: resBody,
  };

  if (cache && resSize < MAX_CACHE_SIZE) {
    REQUEST_CACHE.set(finalURL, { hash: hash(opts), timestamp: Date.now(), response });
  }

  return response;
}

export default rawFetch;
