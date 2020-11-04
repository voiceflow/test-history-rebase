import { GOOGLE_CLIENT_ID } from '@/config';

export const initialize = async () => {
  await new Promise((resolve) => gapi.load('client:auth2', resolve));

  await new Promise((resolve) => gapi.auth2.init({ client_id: GOOGLE_CLIENT_ID }).then(resolve));
};

export const getClient = (scopes: string[]) => {
  const client = gapi.auth2.getAuthInstance();

  return {
    getOfflineToken: () =>
      client.grantOfflineAccess({ scope: scopes.join(' ') }).then(({ code }) => {
        if (!code) throw Error('unable to generate offline access token');

        return code;
      }),
  };
};
