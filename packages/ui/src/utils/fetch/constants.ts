export const GLOBAL_FETCH_HEADERS = new Map();

export const FETCH_REQUEST_CACHE = new Map();

export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  mode: 'cors',
};

export const MAX_FETCH_CACHE_SIZE = 500000; // 1 MB
export const DEFAULT_FETCH_CACHE_TIMEOUT = 1800000; // 30 min

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum StatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
}

const NETWORK_ERROR = Symbol('vf network error identifier');

export class NetworkError<R> extends Error {
  static symbol = NETWORK_ERROR;

  [NETWORK_ERROR] = true;

  constructor(public statusCode: number, message: string, public body?: R) {
    super(message);
  }
}

export const isNetworkError = <R = unknown>(err: any): err is NetworkError<R> => err instanceof NetworkError || !!err[NETWORK_ERROR];
