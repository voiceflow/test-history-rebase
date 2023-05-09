import { logger } from '@ui/utils/logger';

import { DEFAULT_FETCH_OPTIONS } from './constants';
import { FetchMessageFormat, FetchResult } from './types';

export const fetchLogger = logger.child('fetch');

export const buildHeaders = (headers: Map<string, string>) =>
  Array.from(headers.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

export const buildOptions = (rawOpts: RequestInit, globalHeaders: Map<string, string>, body: string | object | undefined, json: boolean) => {
  let opts: RequestInit = {
    ...DEFAULT_FETCH_OPTIONS,
    ...rawOpts,
  };

  const headers = {
    ...buildHeaders(globalHeaders),
    ...opts.headers,
  };

  opts = { ...opts, headers };

  if (json && body && typeof body === 'object') {
    opts = {
      ...opts,
      body: JSON.stringify(body),
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    };
  } else if (!json && body && body instanceof FormData) {
    opts = {
      ...opts,
      body,
    };
  }
  return opts;
};

export const parseResponse = async <R>(res: Response, format: FetchMessageFormat): Promise<{ body: R; size: number }> => {
  if (format === FetchMessageFormat.BLOB) {
    const blob = await res.blob();

    return {
      body: blob as any,
      size: blob.size,
    };
  }

  const text = await res.text();

  try {
    if (format === FetchMessageFormat.JSON && text) {
      const json = JSON.parse(text);

      return {
        body: json as any,
        size: text.length,
      };
    }
  } catch {
    // do nothing
  }

  return {
    body: text as any,
    size: text.length,
  };
};

export const extractBody = <R>({ body }: FetchResult<R>) => body;

export const debugRequest = (url: string, opts: RequestInit, body?: string | object) => {
  fetchLogger.debug(fetchLogger.bold(opts.method || 'GET'), fetchLogger.value(url));
  fetchLogger.debug('body', fetchLogger.value(body));
};
