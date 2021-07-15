import { ChannelErrors, ClientContext } from '@logux/client/react';
import React from 'react';
import { Provider, useStore } from 'react-redux';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useFeature, useOneTimeEffect, usePageAwareTeardown, useSelector } from '@/hooks';
import createRealtimeStore from '@/store/realtime';
import logger from '@/utils/logger';

import { RealtimeStoreContext } from '../contexts/RealtimeStoreContext';

const RealtimeConnectionGate: React.FC = ({ children }) => {
  const globalStore = useStore();
  const userID = useSelector(Account.userIDSelector);
  const authToken = useSelector(Session.authTokenSelector);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const [isLoaded, setLoaded] = React.useState(!atomicActions.isEnabled);

  const result = React.useMemo(() => {
    if (userID == null) {
      logger.warn('realtime not started for unauthenticated session');
      return null;
    }

    const realtime = client.realtime(userID, authToken);
    const awaitSync = realtime.waitFor('synchronized');

    if (atomicActions.isEnabled) {
      realtime.start();
    }

    return {
      awaitSync,
      client: realtime,
      store: createRealtimeStore(globalStore, realtime),
    };
  }, [userID]);

  useOneTimeEffect(() => {
    if (!userID) return false;

    result?.client.changeUser(String(userID));

    return true;
  }, [userID]);

  usePageAwareTeardown(() => {
    result?.client.destroy();
  });

  return result ? (
    <ClientContext.Provider value={result.client}>
      <LoadingGate label="Collaboration" isLoaded={isLoaded} load={() => result.awaitSync.then(() => setLoaded(true))}>
        <ChannelErrors>
          <Provider store={result.store} context={RealtimeStoreContext}>
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
