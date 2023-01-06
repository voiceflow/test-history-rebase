import React from 'react';

import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks/redux';

import { createHOC, HOC } from './utils';

export const withSessionGate: HOC<React.PropsWithChildren> = createHOC('withSessionGate')((Component) => (props) => {
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  return isLoggedIn ? <Component {...props} /> : <>{props.children}</>;
});
