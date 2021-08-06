import { Method } from './constants';

export enum FetchMessageFormat {
  BLOB = 'blob',
  TEXT = 'text',
  JSON = 'json',
}

export type FetchOptions = Pick<RequestInit, 'credentials' | 'mode'> & {
  method?: Method;
  json?: boolean;
  returns?: FetchMessageFormat;
  cache?: boolean;
  expiry?: number | false;
  // eslint-disable-next-line @typescript-eslint/ban-types
  body?: string | object;
  headers?: Record<string, string>;
  unauthorizedInterceptor?: boolean;
  query?: Record<string, string | number | boolean>;
};

export interface FetchResult<R> {
  status: number;
  body: R;
}
