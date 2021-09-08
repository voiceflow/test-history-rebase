import { useClient } from '@logux/client/react';
import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { withFeatureGate } from '@/hocs';
import { useFeature, usePageAwareTeardown, useSelector } from '@/hooks';

import ConnectionWarning from './RealtimeLoadingGate/components/RealtimeConnectionWarning';

/**
 * manages connection to realtime service
 */
const RealtimeConnectionGate: React.FC = ({ children }) => {
  const client = useClient();
  const userID = useSelector(Account.userIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const authToken = useSelector(Session.authTokenSelector);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const [isSynchronized, setSynchronized] = React.useState(!atomicActions.isEnabled);

  // not leader nodes are connected by default if leader is connected
  const [isConnected, setConnected] = React.useState(client.connected);

  React.useEffect(() => {
    let unsubscribe: VoidFunction | null = null;

    if (isLoggedIn) {
      client.changeUser(String(userID), authToken!);

      unsubscribe = client.on('state', () => setConnected(client.connected));

      // eslint-disable-next-line promise/catch-or-return
      client.waitFor('synchronized').then(() => setSynchronized(true));

      client.start();
    } else {
      setConnected(true);
      setSynchronized(true);
    }

    return () => {
      unsubscribe?.();
      setSynchronized(false);
      client.destroy();
    };
  }, [isLoggedIn, !!atomicActions.isEnabled]);

  usePageAwareTeardown(() => {
    client.destroy();
  });

  return (
    <LoadingGate label="Collaboration" isLoaded={isSynchronized}>
      {isConnected ? children : <ConnectionWarning />}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(RealtimeConnectionGate);
