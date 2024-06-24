import type { NextMiddleware } from 'next/server';

import { authClient } from './clients/auth.client';

export const middleware: NextMiddleware = async (request) => {
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return null;
  }

  const cookie = request.cookies.get('auth-token');

  if (cookie) {
    try {
      const result = await authClient.authorize.identity({ authorization: `Bearer ${cookie.value}` });

      // If the user is an internal admin, we don't need to redirect them to the login page
      if (result.identity.type === 'user' && result.identity.internalAdmin) {
        return null;
      }
    } catch (error) {
      // ignore
    }
  }

  const { url } = await authClient.sso.oauth2.google.getEndpoint({
    redirect_uri: `${request.nextUrl.origin}/auth/callback`,
  });

  return Response.redirect(url);
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
