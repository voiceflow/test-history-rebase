import { AxiosError } from 'axios';
import _get from 'lodash/get';

export const normalizeError = (error: unknown, defaultMessage?: string): Error => {
  const bodyDataError = _get(error, ['body', 'data']);

  if (bodyDataError) {
    return new Error(typeof bodyDataError === 'string' ? bodyDataError : JSON.stringify(bodyDataError));
  }

  const bodyErrors = _get(error, ['body', 'errors']) || _get(error, ['body']);

  if (typeof bodyErrors === 'object') {
    const errorMessage = Object.keys(bodyErrors).reduce<string>((str, key) => {
      const error = bodyErrors[key];

      return `${str}${(typeof error === 'object' && error.message) || error}\n`;
    }, '');

    return new Error(errorMessage || 'Unknown network error');
  }

  if (error instanceof AxiosError) {
    if (typeof error.response?.data === 'string') {
      return new Error(error.response.data);
    }

    if (typeof error.response?.data?.message === 'string') {
      return new Error(error.response.data.message);
    }

    return new Error(error.response?.data ? JSON.stringify(error.response.data) : defaultMessage ?? 'Unknown network error');
  }

  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  const errorMessage = _get(error, ['message']);

  if (errorMessage && typeof errorMessage === 'string') {
    return new Error(errorMessage);
  }

  if (typeof error === 'object' && error !== null) {
    return new Error(JSON.stringify(error));
  }

  return new Error(defaultMessage ?? 'Unknown error');
};

export const getErrorMessage = (error: unknown, defaultMessage?: string): string => normalizeError(error, defaultMessage).message;
