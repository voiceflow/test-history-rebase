import { useEffect, useMemo } from 'react';

import { OKTA_CLIENT_ID, OKTA_DOMAIN, OKTA_SCOPES } from '@/config';
import { useTeardown } from '@/hooks';
import OKTA from '@/utils/okta';

export const useErrorTimeout = (hasError: boolean, clearError: () => void) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      clearError();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasError]);
};

export const useOktaLogin = () => {
  const okta = useMemo(
    () =>
      new OKTA({
        domain: OKTA_DOMAIN,
        scopes: OKTA_SCOPES,
        clientID: OKTA_CLIENT_ID,
      }),
    []
  );

  useTeardown(() => {
    okta.closeChannel();
  });

  return async () => {
    const { code } = await okta.login(`${window.location.origin}/login/sso/callback`);

    return code;
  };
};
