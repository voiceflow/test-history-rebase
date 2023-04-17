import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IS_PRIVATE_CLOUD, OKTA_OIN_CLIENT_ID, OKTA_OIN_DOMAIN } from '@/config';
import { Path } from '@/config/routes';
import * as Query from '@/utils/query';

import { LoginForm, SSOLogin } from './components';

const OINLogin: React.FC<RouteComponentProps> = ({ location }) => {
  const query = Query.parse(location.search);

  if (IS_PRIVATE_CLOUD) {
    return <Redirect to={Path.LOGIN} />;
  }

  return (
    <LoginForm query={query}>
      <SSOLogin domain={OKTA_OIN_DOMAIN} clientID={OKTA_OIN_CLIENT_ID} light />
    </LoginForm>
  );
};

export default React.memo(OINLogin);
