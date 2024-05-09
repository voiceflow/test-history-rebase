import { useEffect } from 'react';

import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { initialize as initializeChargebee } from '@/vendors/chargebee';

export const ChargebeeScript = () => {
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  useEffect(() => {
    if (!isLoggedIn) return;
    initializeChargebee();
  }, [isLoggedIn]);

  return null;
};
