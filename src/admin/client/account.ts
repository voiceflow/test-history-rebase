import axios from 'axios';

import { SessionType } from '@/constants';

const SESSION_API = 'session';
const USER_API = 'user';

const SESSION_ENDPOINTS = {
  [SessionType.GOOGLE]: 'googleLogin',
  [SessionType.FACEBOOK]: 'fbLogin',
  [SessionType.BASIC_AUTH]: 'session',
  [SessionType.SIGN_UP]: 'user',
  [SessionType.SSO]: 'ssoLogin',
};

const accountClient = {
  getSession: () => axios.get(`${SESSION_API}`),
  getUser: () => axios.get(`${USER_API}`),
  logout: () => axios.delete(`${SESSION_API}`),
  getVendors: () => axios.get(`${SESSION_API}/vendor?all=true`),

  createSession: (type: Partial<SessionType>, user: unknown) => axios.put(SESSION_ENDPOINTS[type], { user }),
};

export default accountClient;
