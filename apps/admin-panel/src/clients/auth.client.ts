import { AuthClient } from '@voiceflow/sdk-auth';

import { envClient } from './env.client';

export const authClient = new AuthClient({
  fetch: globalThis.fetch.bind(globalThis),
  baseURL: envClient.get('AUTH_API_ENDPOINT'),
});
