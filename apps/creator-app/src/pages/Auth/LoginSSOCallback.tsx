import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { OKTA_SCOPES } from '@/config';
import * as Session from '@/ducks/session';
import { useDispatch, useFeature } from '@/hooks';
import OKTA from '@/utils/okta';
import * as Query from '@/utils/query';

const LoginSSOCallback: React.FC = () => {
  const location = useLocation();

  const ssoSignIn = useDispatch(Session.ssoSignIn);
  const identityUser = useFeature(Realtime.FeatureFlag.IDENTITY_USER);

  React.useEffect(() => {
    if (identityUser.isEnabled) {
      const query = Query.parse(location.search);

      if (query.access_token) {
        ssoSignIn({ token: query.access_token, isNewUser: query.is_new_user === 'true' });
      } else {
        toast.genericError();
      }
    } else {
      const okta = new OKTA(OKTA_SCOPES);

      okta.handleLogin();
    }
  }, []);

  return null;
};

export default LoginSSOCallback;
