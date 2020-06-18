import { Dispatch } from '@/store/types';

import Client from './client';
import createGlobalSocketClient from './global';
import createProjectClient from './project';
import createRealtimeClient from './realtime';

function createSocketClient(dispatch: Dispatch) {
  const client = new Client(dispatch);

  return {
    global: createGlobalSocketClient(client),
    realtime: createRealtimeClient(client),
    project: createProjectClient(client),

    connect: client.connect,
    auth: client.auth,
    disconnect: client.disconnect,
  };
}

export default createSocketClient;

export type SocketClient = ReturnType<typeof createSocketClient>;
