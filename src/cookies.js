import Cookies from 'universal-cookie';

export const AUTH_COOKIE = 'auth';

const cookies = new Cookies();

const creatorUrl = 'creator.voiceflow.com';
const legacyUrl = 'creator.getvoiceflow.com';
let cookieDomain;
if (process.env.NODE_ENV !== 'development') {
  if (window.location.host === creatorUrl) {
    cookieDomain = '.voiceflow.com';
  } else {
    cookieDomain = window.location.host;
  }
} else {
  cookieDomain = 'localhost';
}
const cookieOptions = { path: '/', domain: cookieDomain };

export const removeAuthCookie = () => cookies.remove(AUTH_COOKIE, cookieOptions);

export const setAuthCookie = (token) => cookies.set(AUTH_COOKIE, token, cookieOptions);

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

  return cookies.get(AUTH_COOKIE, cookieOptions);
}

export const removeLastSessionCookie = () => cookies.remove('last_session');
