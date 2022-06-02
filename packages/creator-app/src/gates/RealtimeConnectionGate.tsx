import React from 'react';

import { ConnectionStatus } from '@/client/logux';
import LoadingGate from '@/components/LoadingGate';
import { withSessionGate } from '@/hocs';
import { useLoguxSetup, useRealtimeClient } from '@/hooks';

import ConnectionWarning from './RealtimeLoadingGate/components/RealtimeConnectionWarning';

/**
 * manages connection to realtime service
 */
const RealtimeConnectionGate: React.FC = ({ children }) => {
  const client = useRealtimeClient();

  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => client.on(ConnectionStatus.TERMINATED, () => setReady(false)), []);
  React.useEffect(() => client.on(ConnectionStatus.CONNECTED, () => setReady(true)), []);

  useLoguxSetup(client, {
    onLogout: () => setReady(false),
    onLogoutFail: () => {
      // force reload if unable to teardown session
      window.location.reload();
    },
  });

  if (client.isTerminated) return <ConnectionWarning />;

  return (
    <LoadingGate label="Collaboration" internalName={RealtimeConnectionGate.name} isLoaded={isReady}>
      {children}
    </LoadingGate>
  );
};

export default withSessionGate(RealtimeConnectionGate);
