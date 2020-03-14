import { Method } from './constants';
import rawFetch from './raw';
import { FetchOptions } from './types';
import { extractBody } from './utils';

export * from './constants';

const fetch = Object.assign(rawFetch, {
  get: <R>(url: string, opts?: FetchOptions) => rawFetch<R>(url, { method: Method.GET, ...opts }).then(extractBody),

  post: <R = void>(url: string, body?: string | object, opts?: FetchOptions) =>
    rawFetch<R>(url, { method: Method.POST, body, ...opts }).then(extractBody),

  put: <R = void>(url: string, body?: string | object, opts?: FetchOptions) =>
    rawFetch<R>(url, { method: Method.PUT, body, ...opts }).then(extractBody),

  patch: <R = void>(url: string, body?: string | object, opts?: FetchOptions) =>
    rawFetch<R>(url, { method: Method.PATCH, body, ...opts }).then(extractBody),

  delete: <R = void>(url: string, body?: string | object, opts?: FetchOptions) =>
    rawFetch<R>(url, { method: Method.DELETE, body, ...opts }).then(extractBody),
});

export default fetch;
