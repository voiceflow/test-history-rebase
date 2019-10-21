import { DEVICE_INFO } from '@/config';
import { SessionType } from '@/constants';

import userAdapter from './adapters/user';
import fetch from './fetch';

const SESSION_PATH = 'session';

const SESSION_ENDPOINTS = {
  [SessionType.GOOGLE]: 'googleLogin',
  [SessionType.FACEBOOK]: 'fbLogin',
  [SessionType.BASIC_AUTH]: 'session',
  [SessionType.SIGN_UP]: 'user',
};

const sessionClient = {
  delete: () => fetch.delete(SESSION_PATH),

  create: (type, user) =>
    fetch.put(SESSION_ENDPOINTS[type], { user, device: DEVICE_INFO }).then(({ user, token }) => ({
      user: userAdapter.fromDB(user),
      token,
    })),
};

export default sessionClient;
