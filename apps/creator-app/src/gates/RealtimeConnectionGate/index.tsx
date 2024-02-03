import React from 'react';

import { ConnectionStatus } from '@/client/logux';
import LoadingGate from '@/components/LoadingGate';
import { withSessionGate } from '@/hocs/session';
import { useLoguxSetup, useRealtimeClient } from '@/hooks';

import RealtimeTimeoutControl from './components/RealtimeTimeoutControl';

/**
 * manages connection to realtime service
 */
const RealtimeConnectionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const client = useRealtimeClient();

  const [isReady, setReady] = React.useState(false);
  const [reconnecting, setReconnecting] = React.useState(false);

  React.useEffect(() => client.on(ConnectionStatus.RECONNECTING, () => setReconnecting(true)), []);
  React.useEffect(() => {
    const ready = () => {
      setReady(true);
      setReconnecting(false);
    };

    if (client.isSynced()) ready();
    client.on(ConnectionStatus.CONNECTED, ready);
  }, []);

  useLoguxSetup(client, {
    onLogout: () => setReady(false),
    onLogoutFail: () => {
      // force reload if unable to teardown session
      window.location.reload();
    },
  });

  return (
    <LoadingGate label="Collaboration" internalName={RealtimeConnectionGate.name} isLoaded={isReady}>
      {children}
      {reconnecting && <RealtimeTimeoutControl />}
    </LoadingGate>
  );
};

export default withSessionGate(RealtimeConnectionGate);
