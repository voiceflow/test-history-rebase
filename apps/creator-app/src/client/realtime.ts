import * as Realtime from '@voiceflow/realtime-sdk';
import { io } from 'socket.io-client';

import { REALTIME_ENDPOINT, REALTIME_IO_ENDPOINT } from '@/config';

import LoguxClient from './logux';

export const realtimeIO = (token: string) =>
  io(`${REALTIME_IO_ENDPOINT}`, {
    auth: { token },

    // do not allow downgrading to HTTP
    transports: ['websocket'],
  });

export const realtimeClient = new LoguxClient({
  server: REALTIME_ENDPOINT,
  subprotocol: Realtime.Subprotocol.CURRENT_VERSION,

  // no user specified initially
  userId: 'false',
  timeout: 7000, // down from default 20 seconds
  ping: 5000, // down from default 10 seconds
});
