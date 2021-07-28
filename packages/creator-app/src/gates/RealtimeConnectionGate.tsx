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

const RealtimeConnectionGate: React.FC = ({ children }) => {
  const globalStore = useStore();
  const userID = useSelector(Account.userIDSelector);
  const authToken = useSelector(Session.authTokenSelector);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const [isConnected, setConnected] = React.useState(!atomicActions.isEnabled);

  const result = React.useMemo(() => {
    const realtime = client.realtime(userID, authToken);

    return {
      store: createRealtimeStore(globalStore, realtime),
      client: realtime,
    };
  }, [userID, authToken]);

  React.useEffect(() => {
    if (userID && authToken && atomicActions.isEnabled) {
      // eslint-disable-next-line promise/catch-or-return
      result.client.waitFor('synchronized').then(() => setConnected(true));
      result.client.start();
    } else {
      setConnected(true);
    }

    return () => {
      setConnected(false);
      result.client.destroy();
    };
  }, [result, !!atomicActions.isEnabled]);

  usePageAwareTeardown(() => {
    result.client.destroy();
  });

  return result ? (
    <ClientContext.Provider value={result.client}>
      <LoadingGate label="Collaboration" isLoaded={isConnected}>
        <ChannelErrors>
          <Provider store={result.store} context={RealtimeStoreContext as any}>
            {children}
          </Provider>
        </ChannelErrors>
      </LoadingGate>
    </ClientContext.Provider>
  ) : (
    <>{children}</>
  );
};

export default RealtimeConnectionGate;
