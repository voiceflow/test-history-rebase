import _fetch from 'cross-fetch';

import { API_ENDPOINT, DEBUG_HTTP } from '@/config';

const BOLD_FONT_STYLE = 'font-weight: bold';
const NORMAL_FONT_STYLE = 'font-weight: normal';
const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include',
  mode: 'cors',
  returnBody: true,
};

export class NetworkError extends Error {
  constructor(statusCode, message, body) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
  }
}

// eslint-disable-next-line compat/compat
export const GLOBAL_HEADERS = new Map();

export const getGlobalHeaders = () =>
  Array.from(GLOBAL_HEADERS.entries()).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

async function rawFetch(url, { body, json = true, ...rawOpts } = {}) {
  let opts = {
    ...DEFAULT_FETCH_OPTIONS,
    ...rawOpts,
  };

  const headers = {
    ...getGlobalHeaders(),
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

  const finalURL = `${API_ENDPOINT}/${url}`;
  const res = await _fetch(finalURL, opts);

  let resBody = await res.text();

  try {
    if (json && resBody) {
      resBody = JSON.parse(resBody);
    }
  } catch {
    // do nothing
  }

  if (res.status >= 400) {
    console.error(`%c${opts.method || 'GET'} %c${finalURL}`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE);
    throw new NetworkError(res.status, res.statusText, resBody);
  } else if (DEBUG_HTTP) {
    debugRequest(finalURL, opts, body);
  }

  if (opts.returnBody) {
    return resBody;
  }

  return {
    status: res.status,
    body: resBody,
  };
}

const fetch = Object.assign(rawFetch, {
  get: (url, opts) => rawFetch(url, { method: 'GET', ...opts }),
  post: (url, body, opts) => rawFetch(url, { method: 'POST', body, ...opts }),
  put: (url, body, opts) => rawFetch(url, { method: 'PUT', body, ...opts }),
  patch: (url, body, opts) => rawFetch(url, { method: 'PATCH', body, ...opts }),
  delete: (url, opts) => rawFetch(url, { method: 'DELETE', ...opts }),
});

export default fetch;

/* eslint-disable no-console */
function debugRequest(url, opts, body) {
  console.warn(`%c${opts.method || 'GET'} %c${url}`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE);
  if (typeof body === 'string') {
    console.warn(`%cbody: "%c%${body}%c"`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE, BOLD_FONT_STYLE);
  } else if (body) {
    console.warn('%cbody:', BOLD_FONT_STYLE, body);
  }
}
/* eslint-enable no-console */
