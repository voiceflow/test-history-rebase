import * as PlatformConfig from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch } from '@/hooks/realtime';
import * as Amazon from '@/vendors/amazon';

export const AlexaProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const linkAccount = useDispatch(Account.amazon.linkAccount);

  const api = useContextApi<PlatformConfig.Alexa.Context.Value>({
    linkAccount,
    amazonAuthorize: Amazon.authorize,
    amazonInitialize: Amazon.initialize,
  });

  return (
    <PlatformConfig.Alexa.CONFIG.Context.Provider value={api}>{children}</PlatformConfig.Alexa.CONFIG.Context.Provider>
  );
};
