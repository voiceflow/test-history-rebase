import { Method } from './constants';

export type FetchOptions = Pick<RequestInit, 'credentials' | 'mode'> & {
  method?: Method;
  json?: boolean;
  cache?: boolean;
  expiry?: number | false;
  body?: string | object;
  headers?: Record<string, string>;
};

export type FetchResult<R> = {
  status: number;
  body: R;
};
