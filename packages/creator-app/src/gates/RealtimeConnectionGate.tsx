import React from 'react';

import { ClientEvents, ConnectionStatus } from '@/client/realtime/constants';
import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { withSessionGate } from '@/hocs';
import { useRealtimeClient, useSelector, useStore, useTeardown } from '@/hooks';

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

  const [isReady, setReady] = React.useState(false);
  const teardownClient = React.useRef<VoidFunction | null>(null);

  React.useEffect(() => client.on(ConnectionStatus.TERMINATED, () => setReady(false)), []);
  React.useEffect(() => client.on(ConnectionStatus.CONNECTED, () => setReady(true)), []);
  React.useEffect(
    () =>
      client.on(ClientEvents.WRONG_CREDENTIALS, () => {
        const isLoggedIn = Account.isLoggedInSelector(store.getState());

        if (isLoggedIn) {
          throw new Error('failed to authenticate against realtime service');
        }
      }),
    []
  );

  React.useEffect(() => {
    if (!isLoggedIn) return undefined;

    client.changeUser(String(userID), authToken!);

    // only start the client once we've set the initial user
    if (!teardownClient.current) {
      teardownClient.current = client.start();
    }

    return () => {
      setReady(false);

      client.logout().catch(() => {
        // force reload if unable to teardown session
        window.location.reload();
      });
    };
  }, [isLoggedIn]);

  useTeardown(() => {
    const teardown = teardownClient.current;

    teardownClient.current = null;
    teardown?.();
  });

  if (client.isTerminated) return <ConnectionWarning />;

  return (
    <LoadingGate label="Collaboration" internalName={RealtimeConnectionGate.name} isLoaded={isReady}>
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(RealtimeConnectionGate);
