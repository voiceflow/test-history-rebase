import * as PlatformConfig from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { GooglePromptType } from '@/constants';
import * as Account from '@/ducks/account';
import { useDispatch } from '@/hooks/realtime';
import * as Google from '@/vendors/google';

export const GoogleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const linkAccount = useDispatch(Account.google.linkAccount);

  const googleAuthorize = React.useCallback((scopes: string[]) => {
    const client = Google.getClient(scopes, GooglePromptType.CONSENT);

    return client.getOfflineToken();
  }, []);

  const api = useContextApi<PlatformConfig.Google.Context.Value>({
    linkAccount,
    googleAuthorize,
  });

  return <PlatformConfig.Google.CONFIG.Context.Provider value={api}>{children}</PlatformConfig.Google.CONFIG.Context.Provider>;
};
