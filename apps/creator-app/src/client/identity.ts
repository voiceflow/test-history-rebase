import * as Realtime from '@voiceflow/realtime-sdk';

import { IDENTITY_API_ENDPOINT } from '@/config';
import { getAuthCookie } from '@/utils/cookies';

const currentVersion = new Realtime.Clients.Identity.V1Alpha1({
  token: getAuthCookie,
  baseURL: IDENTITY_API_ENDPOINT,
});

// TODO: to add a new version that is not global: export default Object.assign(currentVersion, { v1 });
export default currentVersion;
