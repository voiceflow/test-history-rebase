import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import { withSessionGate } from '@/hocs/session';
import { useCreatorSubscription, useSelector } from '@/hooks';

const AccountSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const creatorID = useSelector(Account.userIDSelector);

  const isSubscribed = useCreatorSubscription({ creatorID: String(creatorID) }, [creatorID]);

  return (
    <LoadingGate
      internalName={AccountSubscriptionGate.name}
      isLoaded={isSubscribed}
      loader={<TabLoader variant="dark" />}
    >
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(AccountSubscriptionGate);
