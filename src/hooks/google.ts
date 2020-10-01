import React from 'react';

import * as Google from '@/vendors/google';

// eslint-disable-next-line import/prefer-default-export
export const useGoogleLogin = (scopes: string[], onLoad: () => void) =>
  React.useCallback(async () => {
    await Google.authenticateClient(scopes);
    onLoad();

    const client = Google.getClient();

    return client.getOfflineToken();
  }, []);
