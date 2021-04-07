import React from 'react';

import { OKTA_SCOPES } from '@/config';
import OKTA from '@/utils/okta';

const LoginSSOCallback: React.FC = () => {
  React.useEffect(() => {
    const okta = new OKTA(OKTA_SCOPES);

    okta.handleLogin();
  }, []);

  return null;
};

export default LoginSSOCallback;
