import { api } from '@/client/fetch';
import { SessionType } from '@/constants';
import { SessionUser } from '@/models';

const SESSION_API = 'session';
const USER_API = 'user';

const SESSION_ENDPOINTS = {
  [SessionType.GOOGLE]: 'googleLogin',
  [SessionType.FACEBOOK]: 'fbLogin',
  [SessionType.BASIC_AUTH]: 'session',
  [SessionType.SIGN_UP]: 'user',
};

const accountClient = {
  getSession: (): Promise<SessionUser> => api.get(`${SESSION_API}`),
  getUser: (): Promise<SessionUser> => api.get(`${USER_API}`),
  logout: () => api.delete(`${SESSION_API}`),
  getVendors: () => api.get(`${SESSION_API}/vendor?all=true`),
  createSession: (type: Partial<SessionType>, user: unknown): Promise<{ user: SessionUser; token: string }> =>
    api.put(SESSION_ENDPOINTS[type], { user }),
};

export default accountClient;
