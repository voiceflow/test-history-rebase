import { Utils } from '@voiceflow/common';
import { useEffect, useMemo } from 'react';

import client from '@/client';
import { OKTA_SCOPES } from '@/config';
import { useTeardown } from '@/hooks';
import OKTA from '@/utils/okta';

export const getDomainSAML = async (email: string) => {
  if (Utils.emails.isValidEmail(email)) {
    const domain = Utils.emails.getEmailDomain(email);
    const organizationID = await client.organization.checkDomain(domain);

    if (organizationID) {
      return client.organization.getSAMLLogin(organizationID);
    }
  }
  return null;
};

export const useErrorTimeout = (hasError: boolean, clearError: () => void) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      clearError();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasError]);
};

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
