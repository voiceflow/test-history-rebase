import Cookies from 'universal-cookie';

export const AUTH_COOKIE = 'auth';

const cookies = new Cookies();

export const removeAuthCookie = () => cookies.remove(AUTH_COOKIE, { path: '/' });

export const setAuthCookie = (token) => cookies.set(AUTH_COOKIE, token, { path: '/' });

export function getAuthCookie() {
  switch (window.location.host) {
    case 'creator.voiceflow.com':
      cookies.remove(AUTH_COOKIE, { path: '/', domain: 'creator.getvoiceflow.com' });
      break;
    case 'creator.getvoiceflow.com':
      cookies.remove(AUTH_COOKIE, { path: '/', domain: 'creator.voiceflow.com' });
      break;
  }

  return cookies.get(AUTH_COOKIE);
}

export const removeLastSessionCookie = () => cookies.remove('last_session');
