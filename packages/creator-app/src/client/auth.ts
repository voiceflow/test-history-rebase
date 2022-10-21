import * as Realtime from '@voiceflow/realtime-sdk';

import { AUTH_API_ENDPOINT } from '@/config';

const v1 = new Realtime.Clients.Auth.V1({ baseURL: AUTH_API_ENDPOINT });
const currentVersion = new Realtime.Clients.Auth.V1Alpha1({ baseURL: AUTH_API_ENDPOINT });

export default Object.assign(currentVersion, { v1 });
