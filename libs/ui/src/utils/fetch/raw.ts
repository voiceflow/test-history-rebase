import { IS_PRODUCTION } from '@ui/config';
import { stringifyQuery } from '@ui/utils/query';
import hash from 'object-hash';

import {
  DEFAULT_FETCH_CACHE_TIMEOUT,
  FETCH_REQUEST_CACHE,
  GLOBAL_FETCH_HEADERS,
  MAX_FETCH_CACHE_SIZE,
  Method,
  NetworkError,
  StatusCode,
} from './constants';
import { FetchMessageFormat, FetchOptions, FetchResult } from './types';
import { buildOptions, debugRequest, fetchLogger, parseResponse } from './utils';

export const DEBUG_NETWORK = !IS_PRODUCTION && !!process.env.DEBUG_NETWORK;
export const DEBUG_FETCH = !IS_PRODUCTION && (DEBUG_NETWORK || !!process.env.DEBUG_FETCH);

let unauthorizedHandler: (endpoint: string) => void;

export const setUnauthorizedHandler = (handler: (endpoint: string) => void) => {
  unauthorizedHandler = handler;
};

const createRawFetch =
  (apiEndpoint: string) =>
  async <R>(
    url: string,
    {
      body,
      json = true,
      returns = FetchMessageFormat.JSON,
      cache = false,
      expiry = DEFAULT_FETCH_CACHE_TIMEOUT,
      unauthorizedInterceptor = true,
      query = {},
      ...rawOpts
    }: FetchOptions = {}
  ): Promise<FetchResult<R>> => {
    const opts = buildOptions(rawOpts, GLOBAL_FETCH_HEADERS, body, json);

    const finalURL = `${apiEndpoint}/${url}${Object.keys(query).length ? stringifyQuery(query) : ''}`;

    if (cache && FETCH_REQUEST_CACHE.has(finalURL)) {
      const cacheData = FETCH_REQUEST_CACHE.get(finalURL);
      const isValidCache = !expiry || Date.now() - cacheData.timestamp < expiry;

      if (cacheData.hash === hash(opts) && isValidCache) {
        return cacheData.response;
      }
    }

    const res = await fetch(finalURL, opts);

    const { body: resBody, size: resSize } = await parseResponse<R>(res, returns);

    if (unauthorizedInterceptor && res.status === StatusCode.UNAUTHORIZED) {
      await unauthorizedHandler?.(apiEndpoint);
    }

    if (res.status >= StatusCode.BAD_REQUEST) {
      fetchLogger.error(fetchLogger.bold(opts.method || Method.GET), fetchLogger.value(finalURL));
      throw new NetworkError<R>(res.status, res.statusText, resBody);
    } else if (DEBUG_FETCH) {
      debugRequest(finalURL, opts, body);
    }

    const response = {
      status: res.status,
      body: resBody,
    };

    if (cache && resSize < MAX_FETCH_CACHE_SIZE) {
      FETCH_REQUEST_CACHE.set(finalURL, { hash: hash(opts), timestamp: Date.now(), response });
    }

    return response;
  };

export default createRawFetch;
