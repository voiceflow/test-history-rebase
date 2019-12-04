import SocketClient from './client';
import createRealtimeClient from './realtime';

function createSocketClient(dispatch) {
  const client = new SocketClient(dispatch);

  return {
    realtime: createRealtimeClient(client),

    connect: client.connect,
    auth: client.auth,
    disconnect: client.disconnect,
  };
}

export default createSocketClient;
