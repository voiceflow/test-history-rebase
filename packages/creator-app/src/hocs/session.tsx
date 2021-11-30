import React from 'react';

import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';

import { createHOC, HOC } from './utils';

export const withSessionGate: HOC = createHOC('withSessionGate')((Component) => (props) => {
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  return isLoggedIn ? <Component {...props} /> : <>{props.children}</>;
});
