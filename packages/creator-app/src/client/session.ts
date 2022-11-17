import { DEVICE_INFO } from '@voiceflow/ui';

import { SessionType } from '@/constants';
import type { Account } from '@/models';

import { api } from './fetch';

export const SESSION_PATH = 'session';

export const SESSION_ENDPOINTS = {
  [SessionType.GOOGLE]: 'googleLogin',
  [SessionType.FACEBOOK]: 'fbLogin',
  [SessionType.BASIC_AUTH]: 'session',
  [SessionType.SIGN_UP]: 'user',
};

export interface SessionResponsePayload {
  user: Account;
  token: string;
}

const sessionClient = {
  delete: () => api.delete(SESSION_PATH),

  create: (type: SessionType, user: unknown, queryParams = {}) =>
    api.put<SessionResponsePayload>(SESSION_ENDPOINTS[type], { user, device: DEVICE_INFO, queryParams }),
};

export default sessionClient;
