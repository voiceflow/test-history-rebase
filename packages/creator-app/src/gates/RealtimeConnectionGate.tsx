import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { withSessionGate } from '@/hocs';
import { useRealtimeClient, useSelector, useStore } from '@/hooks';

import ConnectionWarning from './RealtimeLoadingGate/components/RealtimeConnectionWarning';

/**
 * manages connection to realtime service
 */
const RealtimeConnectionGate: React.FC = ({ children }) => {
  const client = useRealtimeClient();
  const store = useStore();
  const userID = useSelector(Account.userIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const authToken = useSelector(Session.authTokenSelector);

  // using `useSelector` over `useFeature` to avoid re-rendering
  // when switching between workspaces with AA enabled
  const hasRealtimeConnection = useSelector((state) => Feature.isFeatureEnabledSelector(state)(FeatureFlag.REALTIME_CONNECTION));
  const isAtomicActions = useSelector((state) => Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS));

  const [isSynchronized, setSynchronized] = React.useState(false);
  const [isConnected, setConnected] = React.useState(false);

  // register client handlers
  React.useEffect(() => {
    if (!hasRealtimeConnection) return undefined;

    const removeConnectionObserver = client.on('state', () => setConnected(client.connected));
    const removeErrorHandler = client.node.catch((err) => {
      if (err.type === 'wrong-credentials') {
        const isLoggedIn = Account.isLoggedInSelector(store.getState());

        if (isLoggedIn) {
          throw new Error('failed to authenticate against realtime service');
        }
      }

      // eslint-disable-next-line no-console
      console.error(err);
    });

    return () => {
      removeConnectionObserver();
      removeErrorHandler();
    };
  }, []);

  React.useEffect(() => {
    if (!hasRealtimeConnection || !isLoggedIn) return undefined;

    client.changeUser(String(userID), authToken!);

    if (!client.connected) {
      client.start();
    }

    // eslint-disable-next-line promise/catch-or-return
    client.waitFor('synchronized').then(() => setSynchronized(true));

    return () => {
      setConnected(false);
      setSynchronized(false);

      client.logout().catch(() => {
        // force reload if unable to teardown session
        window.location.reload();
      });
    };
  }, [isLoggedIn]);

  if (!hasRealtimeConnection) return <>{children}</>;

  return (
    <LoadingGate label="Collaboration" isLoaded={!isAtomicActions || isSynchronized}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isAtomicActions ? isConnected ? children : <ConnectionWarning /> : children}
    </LoadingGate>
  );
};

export default withSessionGate(RealtimeConnectionGate);
