import { getAuthCookie } from '@/utils/cookies';

export const AUTH_HEADERS = {
  get Authorization() {
    const token = getAuthCookie();

    return token ? `Bearer ${token}` : '';
  },
};
