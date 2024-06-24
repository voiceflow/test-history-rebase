import { IdentityClient } from '@voiceflow/sdk-identity';

import { AUTH_HEADERS } from './client.constant';
import { envClient } from './env.client';

export const identityClient = new IdentityClient({
  fetch: globalThis.fetch.bind(globalThis),
  baseURL: envClient.get('IDENTITY_API_ENDPOINT'),
  headers: AUTH_HEADERS,
});
