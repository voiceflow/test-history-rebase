import Cookies from 'universal-cookie';

import { IS_DEVELOPMENT } from '@/config';

export const AUTH_COOKIE = 'auth_vf';

const cookies = new Cookies();

const creatorUrl = 'creator.voiceflow.com';
const legacyUrl = 'creator.getvoiceflow.com';
let cookieDomain;
if (!IS_DEVELOPMENT) {
  if (window.location.host === legacyUrl) {
    cookieDomain = window.location.host;
  } else {
    cookieDomain = 'voiceflow.com';
  }
} else {
  cookieDomain = 'localhost';
}
const cookieOptions = { path: '/', domain: cookieDomain };

export const removeAuthCookie = () => cookies.remove(AUTH_COOKIE, cookieOptions);

export const setAuthCookie = (token) => {
  cookies.set(AUTH_COOKIE, token, cookieOptions);
  window.CreatorSocket && window.CreatorSocket.authCB && window.CreatorSocket.authCB(token);
};

export function getAuthCookie() {
  switch (window.location.host) {
    case creatorUrl:
      cookies.remove(AUTH_COOKIE, { path: '/', domain: legacyUrl });
      break;
    case legacyUrl:
      cookies.remove(AUTH_COOKIE, cookieOptions);
      break;
    // no default
  }

  return cookies.get(AUTH_COOKIE);
}

export const removeLastSessionCookie = () => cookies.remove('last_session');
