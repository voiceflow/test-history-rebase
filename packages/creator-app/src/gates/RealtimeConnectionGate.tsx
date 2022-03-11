import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
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

  const [isSynchronized, setSynchronized] = React.useState(false);
  const [isConnected, setConnected] = React.useState(false);

  // register client handlers
  React.useEffect(() => {
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
    if (!isLoggedIn) return undefined;

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

  return (
    <LoadingGate label="Collaboration" isLoaded={isSynchronized}>
      {isConnected ? children : <ConnectionWarning />}
    </LoadingGate>
  );
};

export default withSessionGate(RealtimeConnectionGate);
