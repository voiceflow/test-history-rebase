import SocketClient from './client';
import createGlobalSocketClient from './global';
import createRealtimeClient from './realtime';

function createSocketClient(dispatch) {
  const client = new SocketClient(dispatch);

  return {
    global: createGlobalSocketClient(client),
    realtime: createRealtimeClient(client),

    connect: client.connect,
    auth: client.auth,
    disconnect: client.disconnect,
  };
}

export default createSocketClient;
