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

  amazon: {
    linkAccount: (code) => fetch.post(`${SESSION_PATH}/amazon/verify_token`, { code }),

    getAccount: () => fetch.get(`${SESSION_PATH}/amazon/access_token`),

    deleteAccount: () => fetch.delete(`${SESSION_PATH}/amazon`),
  },

  google: {
    linkAccount: (code) => fetch.post(`${SESSION_PATH}/google/verify_token`, { code }),

    getAccount: () => fetch.get(`${SESSION_PATH}/google/access_token`),

    deleteAccount: () => fetch.delete(`${SESSION_PATH}/google/access_token`),
  },
};

export default sessionClient;
