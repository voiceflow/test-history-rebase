import * as Realtime from '@voiceflow/realtime-sdk';

import { AUTH_API_ENDPOINT } from '@/config';
import { getAuthCookie } from '@/utils/cookies';

const v1 = new Realtime.Clients.Auth.V1({ token: getAuthCookie, baseURL: AUTH_API_ENDPOINT });

const currentVersion = new Realtime.Clients.Auth.V1Alpha1({ token: getAuthCookie, baseURL: AUTH_API_ENDPOINT });

export default Object.assign(currentVersion, { v1 });
