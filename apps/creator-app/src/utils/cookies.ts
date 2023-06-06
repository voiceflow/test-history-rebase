import { getCookieByName, removeCookie, setCookie } from '@voiceflow/ui';

import { CREATOR_URL, LEGACY_URL, ROOT_DOMAIN } from '@/config';

export { getAllCookies as getAll, getCookieByName as getByName, removeCookie as remove } from '@voiceflow/ui';

export const AUTH_COOKIE = 'auth_vf';
export const MAINTENANCE_COOKIE = 'maintenance';

const COOKIE_OPTIONS = { path: '/', domain: ROOT_DOMAIN };

export const removeAuthCookie = () => removeCookie(AUTH_COOKIE, COOKIE_OPTIONS);

export const setAuthCookie = (token: string) => setCookie(AUTH_COOKIE, token, COOKIE_OPTIONS);

export const getAuthCookie = () => {
  if (window.location.host === CREATOR_URL) {
    removeCookie(AUTH_COOKIE, { path: '/', domain: LEGACY_URL });
  }

  return getCookieByName(AUTH_COOKIE);
};

// TODO: is this still needed?
export const removeLastSessionCookie = () => removeCookie('last_session');

export const getMaintenanceCookie = () => getCookieByName<string | undefined>(MAINTENANCE_COOKIE);
