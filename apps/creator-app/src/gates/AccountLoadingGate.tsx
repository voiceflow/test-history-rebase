import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';

const AccountLoadingGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isLoggingIn = useSelector(Account.isLoggingInSelector);
  const restoreSession = useDispatch(Session.restoreSession);

  return (
    <LoadingGate internalName={AccountLoadingGate.name} isLoaded={!isLoggingIn} load={restoreSession} loader={<TabLoader variant="dark" />}>
      {children}
    </LoadingGate>
  );
};

export default AccountLoadingGate;
