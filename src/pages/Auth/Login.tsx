import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as Query from '@/utils/query';

import { LoginForm, SocialLogin } from './components';

const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);

  return (
    <LoginForm query={query}>
      <SocialLogin light />
    </LoginForm>
  );
};

export default React.memo(Login);
