// eslint-disable-next-line compat/compat
export const GLOBAL_HEADERS = new Map();

// eslint-disable-next-line compat/compat
export const REQUEST_CACHE = new Map();

export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  mode: 'cors',
};

export const MAX_CACHE_SIZE = 500000; // 1 MB
export const DEFAULT_CACHE_TIMEOUT = 1800000; // 30 min

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum StatusCode {
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
}

export class NetworkError<R> extends Error {
  constructor(public statusCode: number, message: string, public body?: R) {
    super(message);
  }
}
