import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SeoHelmet from '@/components/SeoHelmet';
import { IS_MOTOROLA_PRIVATE_CLOUD } from '@/config';
import { Path } from '@/config/routes';
import { SeoPage } from '@/constants/seo';
import { useFeature } from '@/hooks';
import * as Query from '@/utils/query';

import { LoginForm, SocialLogin } from './components';

const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);
  const motorolaSSO = useFeature(Realtime.FeatureFlag.MOTOROLA_SSO);

  if (motorolaSSO.isEnabled && IS_MOTOROLA_PRIVATE_CLOUD) {
    return <Redirect to={Path.LOGIN_MOTOROLA} />;
  }

  return (
    <LoginForm query={query}>
      <SeoHelmet page={SeoPage.LOGIN} />
      <SocialLogin loginMode light />
    </LoginForm>
  );
};

export default React.memo(Login);
