import { useEffect } from 'react';

import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks';
import * as chargebee from '@/vendors/chargebee';

export const ChargebeeScript = () => {
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const hasSubscription = !!useSelector(Organization.chargebeeSubscriptionSelector);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!hasSubscription) return;

    const initialize = async () => {
      try {
        await chargebee.initialize();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error initializing Chargebee', e);
      }
    };

    initialize();
  }, [isLoggedIn, !!hasSubscription]);

  return null;
};
