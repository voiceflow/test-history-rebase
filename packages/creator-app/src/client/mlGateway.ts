import { ML_GATEWAY_ENDPOINT } from '@/config';

import LoguxClient from './logux';

const mlGatewayClient = (): LoguxClient =>
  new LoguxClient({
    server: ML_GATEWAY_ENDPOINT || '',
    subprotocol: '1.0.0',

    // no user specified initially
    userId: 'false',
    timeout: 5000, // down from default 20 seconds
    ping: 5000, // down from default 10 seconds
  });

export default mlGatewayClient;
