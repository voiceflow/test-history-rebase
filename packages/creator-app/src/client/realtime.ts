import { REALTIME_ENDPOINT } from '@/config';

import { LoguxClient } from './utils';

const realtimeClient = (): LoguxClient =>
  new LoguxClient({
    server: REALTIME_ENDPOINT || '',
    subprotocol: '1.0.0',

    // no user specified initially
    userId: 'false',
  });

export default realtimeClient;
