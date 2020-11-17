import { DEVICE_INFO } from '@/config';
import { SessionType } from '@/constants';
import { Account } from '@/models';

import fetch from './fetch';

const SESSION_PATH = 'session';

const SESSION_ENDPOINTS = {
  [SessionType.SSO]: 'ssoLogin',
  [SessionType.GOOGLE]: 'googleLogin',
  [SessionType.FACEBOOK]: 'fbLogin',
  [SessionType.BASIC_AUTH]: 'session',
  [SessionType.SIGN_UP]: 'user',
};

const sessionClient = {
  delete: () => fetch.delete(SESSION_PATH),

  create: (type: SessionType, user: unknown) => fetch.put<{ user: Account; token: string }>(SESSION_ENDPOINTS[type], { user, device: DEVICE_INFO }),
};

export default sessionClient;
