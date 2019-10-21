import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import createSocketClient from '@/client/socket';
import LoadingGate from '@/components/LoadingGate';
import { authTokenSelector, tabIDSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';

const SocketLoadingGate = ({ authToken, tabID, children }) => {
  const [isConnected, acknowledgeConnection] = useEnableDisable();
  const dispatch = useDispatch();
  const disconnectSocket = () => client.socket.disconnect();
  const connectSocket = async () => {
    try {
      client.socket = createSocketClient(dispatch);

      await client.socket.connect(authToken, tabID);

      acknowledgeConnection();
    } catch (err) {
      console.error('failed to connect to socket', err);
    }
  };

  return (
    <LoadingGate label="Realtime" isLoaded={isConnected} load={connectSocket} unload={disconnectSocket}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  tabID: tabIDSelector,
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(SocketLoadingGate);
