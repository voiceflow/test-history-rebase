import { useMemo } from 'react';

import { OKTA_SCOPES } from '@/config';
import { useTeardown } from '@/hooks';
import OKTA from '@/utils/okta';

export const useOktaLogin = (domain: string, clientID: string) => {
  const okta = useMemo(() => new OKTA(OKTA_SCOPES), []);

  useTeardown(() => {
    okta.closeChannel();
  });

  return async () => {
    const { code } = await okta.login({
      domain,
      clientID,
      redirectURI: `${window.location.origin}/login/sso/callback`,
    });

    return code;
  };
};
