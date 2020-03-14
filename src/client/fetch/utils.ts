import _fetch from 'cross-fetch';

import { DEFAULT_FETCH_OPTIONS } from './constants';
import { FetchResult } from './types';

export { _fetch };

const BOLD_FONT_STYLE = 'font-weight: bold';
const NORMAL_FONT_STYLE = 'font-weight: normal';

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
  }

  return opts;
};

export const parseResponseBody = <R>(body: string, json: boolean): R => {
  try {
    if (json && body) {
      return JSON.parse(body);
    }
  } catch {
    // do nothing
  }

  return body as any;
};

export const extractBody = <R>({ body }: FetchResult<R>) => body;

/* eslint-disable no-console */
export const debugRequest = (url: string, opts: RequestInit, body?: string | object) => {
  console.warn(`%c${opts.method || 'GET'} %c${url}`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE);
  if (typeof body === 'string') {
    console.warn(`%cbody: "%c%${body}%c"`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE, BOLD_FONT_STYLE);
  } else if (body) {
    console.warn('%cbody:', BOLD_FONT_STYLE, body);
  }
};
/* eslint-enable no-console */
