import { Method } from './constants';
import createRawFetch from './raw';
import type { FetchOptions } from './types';
import { extractBody } from './utils';

export * from './constants';
export { setUnauthorizedHandler } from './raw';
export * from './types';
export { fetchLogger } from './utils';

export const createFetch = (apiEndpoint: string) => {
  const rawFetch = createRawFetch(apiEndpoint);

  return Object.assign(rawFetch, {
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
};
