import { GOOGLE_CLIENT_ID } from '@/config';
import type { GooglePromptType } from '@/constants';

export const initialize = async () => {
  await new Promise((resolve) => {
    gapi.load('client:auth2', resolve);
  });

  await new Promise((resolve) => {
    // eslint-disable-next-line promise/catch-or-return
    gapi.auth2.init({ client_id: GOOGLE_CLIENT_ID }).then(resolve);
  });
};

export const getClient = (scopes: string[], prompt?: GooglePromptType) => {
  const client = gapi.auth2.getAuthInstance();

  return {
    getOfflineToken: () =>
      client.grantOfflineAccess({ scope: scopes.join(' '), prompt }).then(({ code }) => {
        if (!code) throw new Error('unable to generate offline access token');

        return code;
      }),
  };
};
