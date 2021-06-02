import React from 'react';

import { GooglePromptType } from '@/constants';
import * as Google from '@/vendors/google';

// eslint-disable-next-line import/prefer-default-export
export const useGoogleLogin = (scopes: string[], onLoad?: () => void, prompt?: GooglePromptType) =>
  React.useCallback(async () => {
    onLoad?.();

    const client = Google.getClient(scopes, prompt);

    return client.getOfflineToken();
  }, []);
