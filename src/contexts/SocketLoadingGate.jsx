import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import createSocketClient from '@/client/socket';
import LoadingGate from '@/components/LoadingGate';
import { useEnableDisable } from '@/hooks';

const SocketLoadingGate = ({ children }) => {
  const [isConnected, acknowledgeConnection] = useEnableDisable();
  const dispatch = useDispatch();
  const disconnectSocket = () => client.socket.disconnect();
  const connectSocket = async () => {
    try {
      client.socket = createSocketClient(dispatch);

      await client.socket.connect();

      acknowledgeConnection();
    } catch (err) {
      console.error('failed to connect to socket', err);
    }
  };

  return (
    <LoadingGate label="Connection" isLoaded={isConnected} load={connectSocket} unload={disconnectSocket}>
      {children}
    </LoadingGate>
  );
};

export default SocketLoadingGate;
