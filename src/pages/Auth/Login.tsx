import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IS_MOTOROLA_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import { useFeature } from '@/hooks';
import * as Query from '@/utils/query';

import { LoginForm, SocialLogin } from './components';

const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);
  const motorolaSSO = useFeature(FeatureFlag.MOTOROLA_SSO);

  if (motorolaSSO.isEnabled && IS_MOTOROLA_PRIVATE_CLOUD) {
    return <Redirect to={Path.LOGIN_MOTOROLA} />;
  }

  return (
    <LoginForm query={query}>
      <SocialLogin light />
    </LoginForm>
  );
};

export default React.memo(Login);
