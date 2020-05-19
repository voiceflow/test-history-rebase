import Cookies, { CookieGetOptions } from 'universal-cookie';

import { CREATOR_URL, LEGACY_URL, ROOT_DOMAIN } from '@/config';

export const AUTH_COOKIE = 'auth_vf';
export const MAINTENANCE_COOKIE = 'maintenance';

const COOKIE_OPTIONS = { path: '/', domain: ROOT_DOMAIN };

const cookies = new Cookies();

export const getByName = <R extends any = string>(name: string, options?: CookieGetOptions): R => cookies.get(name, options);

export const removeAuthCookie = () => cookies.remove(AUTH_COOKIE, COOKIE_OPTIONS);

export const setAuthCookie = (token: string) => cookies.set(AUTH_COOKIE, token, COOKIE_OPTIONS);

export const getAuthCookie = () => {
  switch (window.location.host) {
    case CREATOR_URL:
      cookies.remove(AUTH_COOKIE, { path: '/', domain: LEGACY_URL });
      break;
    case LEGACY_URL:
      cookies.remove(AUTH_COOKIE, COOKIE_OPTIONS);
      break;
    // no default
  }

  return getByName(AUTH_COOKIE);
};

// TODO: is this still needed?
export const removeLastSessionCookie = () => cookies.remove('last_session');

export function getMaintenanceCookie() {
  return getByName<string | undefined>(MAINTENANCE_COOKIE);
}
