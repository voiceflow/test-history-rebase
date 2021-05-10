import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

const SocketLoadingGate: React.FC<ConnectedSocketLoadingGateProps> = ({ disableWebsockets, children }) => {
  const [isConnected, acknowledgeConnection] = useEnableDisable();
  const websocketsSupported = !!window.WebSocket;

  const disconnectSocket = React.useCallback(() => client.socket!.disconnect(), []);

  const connectSocket = React.useCallback(async () => {
    try {
      await client.socket.connect();

      acknowledgeConnection();
    } catch (err) {
      Sentry.error(err);
    }
  }, []);

  React.useEffect(() => {
    if (!websocketsSupported) {
      disableWebsockets();
    }
  }, [disableWebsockets, websocketsSupported]);

  return (
    <LoadingGate label="Connection" isLoaded={!websocketsSupported || isConnected} load={connectSocket} unload={disconnectSocket}>
      {children}
    </LoadingGate>
  );
};

const mapDispatchToProps = {
  disableWebsockets: Session.disableWebsockets,
};

type ConnectedSocketLoadingGateProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocketLoadingGate);
