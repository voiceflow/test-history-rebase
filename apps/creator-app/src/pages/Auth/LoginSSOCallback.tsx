import { toast } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import * as Query from '@/utils/query';

const LoginSSOCallback: React.FC = () => {
  const location = useLocation();

  const ssoSignIn = useDispatch(Session.ssoSignIn);
  const goToLoginPage = useDispatch(Router.goToLogin);

  React.useEffect(() => {
    const query = Query.parse(location.search);

    if (query.access_token) {
      ssoSignIn({ token: query.access_token, isNewUser: query.is_new_user === 'true' });
    } else {
      if (query.error) {
        toast.error(`Login failed: ${query.error}`);
      } else {
        toast.genericError();
      }

      goToLoginPage();
    }
  }, []);

  return null;
};

export default LoginSSOCallback;
