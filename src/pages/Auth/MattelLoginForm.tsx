import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as Query from '@/utils/query';

import { LoginForm, SSOLogin } from './components';

const MattelLoginForm: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);

  return (
    <LoginForm query={query}>
      <SSOLogin light />
    </LoginForm>
  );
};

export default React.memo(MattelLoginForm);
