import { Client } from '@logux/client';

import { REALTIME_ENDPOINT } from '@/config';

const realtimeClient = (clientID: number | null, token: string | null) =>
  new Client({
    server: REALTIME_ENDPOINT,
    subprotocol: '1.0.0',
    userId: String(clientID),
    token: token ?? '',
  });

export default realtimeClient;
