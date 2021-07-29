import { ChannelErrors, ClientContext } from '@logux/client/react';
import React from 'react';
import { Provider, useStore } from 'react-redux';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useFeature, usePageAwareTeardown, useSelector } from '@/hooks';
import createRealtimeStore from '@/store/realtime';

import { RealtimeStoreContext } from '../contexts/RealtimeStoreContext';
import ConnectionWarning from './RealtimeLoadingGate/components/RealtimeConnectionWarning';

const RealtimeConnectionGate: React.FC = ({ children }) => {
  const globalStore = useStore();
  const userID = useSelector(Account.userIDSelector);
  const authToken = useSelector(Session.authTokenSelector);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const [isSynchronized, setSynchronized] = React.useState(!atomicActions.isEnabled);

  const result = React.useMemo(() => {
    const realtime = client.realtime(userID, authToken);

    return {
      store: createRealtimeStore(globalStore, realtime),
      client: realtime,
    };
  }, [userID, authToken]);

  // not leader nodes are connected by default if leader is connected
  const [isConnected, setConnected] = React.useState(!atomicActions.isEnabled || result.client.connected);

  React.useEffect(() => {
    let unsubscribe: VoidFunction | null = null;

    if (userID && authToken && atomicActions.isEnabled) {
      unsubscribe = result.client.on('state', () => setConnected(result.client.connected));

      // eslint-disable-next-line promise/catch-or-return
      result.client.waitFor('synchronized').then(() => setSynchronized(true));

      result.client.start();
    } else {
      setConnected(true);
      setSynchronized(true);
    }

    return () => {
      unsubscribe?.();
      setSynchronized(false);
      result.client.destroy();
    };
  }, [result, !!atomicActions.isEnabled]);

  usePageAwareTeardown(() => {
    result.client.destroy();
  });

  return (
    <ClientContext.Provider value={result.client}>
      <LoadingGate label="Collaboration" isLoaded={isSynchronized}>
        <ChannelErrors>
          <Provider store={result.store} context={RealtimeStoreContext as any}>
            {isConnected ? children : <ConnectionWarning />}
          </Provider>
        </ChannelErrors>
      </LoadingGate>
    </ClientContext.Provider>
  );
};

export default RealtimeConnectionGate;
