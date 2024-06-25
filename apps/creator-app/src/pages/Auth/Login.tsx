import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';

import SeoHelmet from '@/components/SeoHelmet';
import { SeoPage } from '@/constants/seo';
import * as Query from '@/utils/query';

import { LoginForm, SocialLogin } from './components';

const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);

  return (
    <LoginForm query={query}>
      <SeoHelmet page={SeoPage.LOGIN} />
      <SocialLogin loginMode light />
    </LoginForm>
  );
};

export default React.memo(Login);
