import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import { withSessionGate } from '@/hocs';
import { useCreatorSubscription, useSelector } from '@/hooks';

const AccountSubscriptionGate: React.FC = ({ children }) => {
  const creatorID = useSelector(Account.userIDSelector);

  const isSubscribed = useCreatorSubscription({ creatorID: String(creatorID) });

  return (
    <LoadingGate label="Account" zIndex={50} isLoaded={isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(AccountSubscriptionGate);
