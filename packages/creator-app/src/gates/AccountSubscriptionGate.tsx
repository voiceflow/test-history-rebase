import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import { withSessionGate } from '@/hocs/session';
import { useCreatorSubscription, useSelector } from '@/hooks';

const AccountSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const creatorID = useSelector(Account.userIDSelector);

  const isSubscribed = useCreatorSubscription({ creatorID: String(creatorID) }, [creatorID]);

  return (
    <LoadingGate label="Account" internalName={AccountSubscriptionGate.name} zIndex={50} isLoaded={isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(AccountSubscriptionGate);
