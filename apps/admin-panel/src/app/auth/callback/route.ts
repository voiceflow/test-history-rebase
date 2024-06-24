import { authClient } from '@/clients/auth.client';

export const revalidate = 60;

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);

    const accessToke = url.searchParams.get('access_token');

    if (!accessToke) {
      throw new Error('Access token not found');
    }

    const result = await authClient.authorize.identity({ authorization: `Bearer ${accessToke}` });

    if (result.identity.type !== 'user' || !result.identity.internalAdmin) {
      throw new Error('Not an admin');
    }

    return new Response('Redirecting...', {
      status: 302,
      headers: {
        Location: url.origin,
        'Set-Cookie': `auth-token=${accessToke}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400;`,
      },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : JSON.stringify(error), { status: 400 });
  }
};
