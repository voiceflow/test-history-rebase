import { ClientException } from '@voiceflow/exception';
import { Response } from 'undici';

export const isFetchResponseError = (error: unknown): error is { response: ClientException<Response> } => {
  return typeof error === 'object' && error !== null && 'response' in error && error.response instanceof Response;
};
