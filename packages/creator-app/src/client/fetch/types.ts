import { Method } from './constants';

export enum MessageFormat {
  BLOB = 'blob',
  TEXT = 'text',
  JSON = 'json',
}

export type FetchOptions = Pick<RequestInit, 'credentials' | 'mode'> & {
  method?: Method;
  json?: boolean;
  returns?: MessageFormat;
  cache?: boolean;
  expiry?: number | false;
  body?: string | object;
  headers?: Record<string, string>;
  unauthorizedInterceptor?: boolean;
  query?: Record<string, string | number | boolean>;
};

export type FetchResult<R> = {
  status: number;
  body: R;
};
