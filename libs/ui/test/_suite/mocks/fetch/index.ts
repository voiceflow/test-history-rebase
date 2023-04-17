import { Fetch } from './types';

export * as FetchTypes from './types';

export const fetch: Fetch = (...responses) => {
  let index = 0;

  const fetch = vi.fn<[input: RequestInfo | URL, init?: RequestInit | undefined], Promise<{ status: number; text: () => Promise<string> }>>(
    globalThis.fetch
  );

  vi.stubGlobal('fetch', fetch);

  fetch.mockImplementation(() => {
    const response = responses[index++];

    if (!response) return Promise.resolve({ status: 200, text: () => Promise.resolve('empty body') });

    return Promise.resolve({
      status: response.status,
      text: () => (response.error ? Promise.reject(new Error(response.error)) : Promise.resolve(response.body)),
    });
  });

  vi.stubGlobal('fetch', fetch);

  return fetch;
};
