import { GOOGLE_CLIENT_ID } from '@/config';

export const authenticateClient = async (scopes: string[]) => {
  await new Promise((resolve) => gapi.load('client:auth2', resolve));

  await gapi.client.init({ clientId: GOOGLE_CLIENT_ID, scope: scopes.join(' ') });
};

export const getClient = () => {
  const client = gapi.auth2.getAuthInstance();

  return {
    getOfflineToken: () =>
      client.grantOfflineAccess().then(({ code }) => {
        if (!code) throw Error('unable to generate offline access token');

        return code;
      }),
  };
};
