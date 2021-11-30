import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import { withSessionGate } from '@/hocs';
import { useCreatorSubscription, useSelector } from '@/hooks';

const AccountSubscriptionGate: React.FC = ({ children }) => {
  const creatorID = useSelector(Account.userIDSelector);

  // using `useSelector` over `useFeature` to avoid re-rendering
  // when switching between workspaces with AA enabled
  const hasRealtimeConnection = useSelector((state) => Feature.isFeatureEnabledSelector(state)(FeatureFlag.REALTIME_CONNECTION));
  const isAtomicActions = useSelector((state) => Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS));
  const shouldConnect = hasRealtimeConnection && isAtomicActions;

  const isSubscribed = useCreatorSubscription({ creatorID: shouldConnect ? String(creatorID) : null });

  return (
    <LoadingGate label="Account" zIndex={50} isLoaded={!shouldConnect || isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(AccountSubscriptionGate);
