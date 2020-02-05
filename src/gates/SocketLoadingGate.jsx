import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import createSocketClient from '@/client/socket';
import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { handleRealtimeSessionCancelled } from '@/store/sideEffects';

const SocketLoadingGate = ({ disableWebsockets, children }) => {
  const [isConnected, acknowledgeConnection] = useEnableDisable();
  const dispatch = useDispatch();
  const disconnectSocket = () => client.socket.disconnect();
  const sessionCancelHandler = (data) => dispatch(handleRealtimeSessionCancelled(data));
  const websocketsSupported = !!window.WebSocket;

  const connectSocket = async () => {
    try {
      client.socket = createSocketClient(dispatch);

      await client.socket.connect(sessionCancelHandler);

      acknowledgeConnection();
    } catch (err) {
      console.error('failed to connect to socket', err);
    }
  };

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

export default connect(
  null,
  mapDispatchToProps
)(SocketLoadingGate);
