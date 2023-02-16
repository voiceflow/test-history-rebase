import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IS_PRIVATE_CLOUD, OKTA_CLIENT_ID, OKTA_DOMAIN } from '@/config';
import { Path } from '@/config/routes';
import * as Query from '@/utils/query';

import { LoginForm, SSOLogin } from './components';

const MattelLogin: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);

  if (IS_PRIVATE_CLOUD) {
    return <Redirect to={Path.LOGIN} />;
  }

  return (
    <LoginForm query={query}>
      <SSOLogin domain={OKTA_DOMAIN} clientID={OKTA_CLIENT_ID} light />
    </LoginForm>
  );
};

export default React.memo(MattelLogin);
