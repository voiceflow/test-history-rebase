import { Client } from '@logux/client';

import { REALTIME_ENDPOINT } from '@/config';

const realtimeClient = (): Client =>
  new Client({
    server: REALTIME_ENDPOINT || '',
    subprotocol: '1.0.0',

    // anonymous user for use while logged out
    userId: 'anonymous',
  });

export default realtimeClient;
