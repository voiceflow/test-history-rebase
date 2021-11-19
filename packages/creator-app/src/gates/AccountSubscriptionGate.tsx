import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import { withFeatureGate } from '@/hocs';
import { useCreatorSubscription, useSelector } from '@/hooks';

const AccountSubscriptionGate: React.FC = ({ children }) => {
  const creatorID = useSelector(Account.userIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  const isSubscribed = useCreatorSubscription({ creatorID: creatorID ? String(creatorID) : null });

  if (!isLoggedIn) return <>{children}</>;

  return (
    <LoadingGate label="Account" zIndex={50} isLoaded={isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.REALTIME_CONNECTION)(AccountSubscriptionGate);
