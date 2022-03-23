import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { useEnableDisable } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

/**
 * establishes and maintains connection with the websocket service
 */
const SocketLoadingGate: React.FC = ({ children }) => {
  const [isConnected, acknowledgeConnection] = useEnableDisable();

  const disconnectSocket = React.useCallback(() => client.socket?.disconnect(), []);

  const connectSocket = React.useCallback(async () => {
    try {
      await client.socket.connect();

      acknowledgeConnection();
    } catch (err) {
      Sentry.error(err);
    }
  }, []);

  return (
    <LoadingGate label="Connection" internalName={SocketLoadingGate.name} isLoaded={isConnected} load={connectSocket} unload={disconnectSocket}>
      {children}
    </LoadingGate>
  );
};

export default SocketLoadingGate;
