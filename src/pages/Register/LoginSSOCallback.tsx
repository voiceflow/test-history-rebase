import React from 'react';

import { OKTA_CLIENT_ID, OKTA_DOMAIN, OKTA_SCOPES } from '@/config';
import OKTA from '@/utils/okta';

const LoginSSOCallback = () => {
  React.useEffect(() => {
    const okta = new OKTA({
      domain: OKTA_DOMAIN,
      scopes: OKTA_SCOPES,
      clientID: OKTA_CLIENT_ID,
    });

    okta.handleLogin();
  }, []);

  return null;
};

export default LoginSSOCallback;
