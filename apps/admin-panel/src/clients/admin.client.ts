import { AdminClient } from '@voiceflow/sdk-admin';

import { AUTH_HEADERS } from './client.constant';
import { envClient } from './env.client';

export const adminClient = new AdminClient({
  fetch: globalThis.fetch.bind(globalThis),
  baseURL: envClient.get('ADMIN_API_ENDPOINT'),
  headers: AUTH_HEADERS,
});
