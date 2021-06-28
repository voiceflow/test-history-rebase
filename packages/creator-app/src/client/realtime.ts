import { CrossTabClient, IndexedStore } from '@logux/client';

import { REALTIME_ENDPOINT } from '@/config';

const realtimeClient = (clientID?: number) =>
  new CrossTabClient({
    store: new IndexedStore('creator_realtime'),
    server: REALTIME_ENDPOINT,
    subprotocol: '1.0.0',
    userId: String(clientID), // TODO: authentication
    token: '', // TODO: authentication
  });

export default realtimeClient;
