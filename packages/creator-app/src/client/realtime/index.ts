import { io } from 'socket.io-client';

import { REALTIME_ENDPOINT, REALTIME_IO_ENDPOINT } from '@/config';

import LoguxClient from './loguxClient';

export const realtimeIO = (token: string) =>
  io(`${REALTIME_IO_ENDPOINT}`, {
    auth: { token },

    // do not allow downgrading to HTTP
    transports: ['websocket'],
  });

const realtimeClient = (): LoguxClient =>
  new LoguxClient({
    server: REALTIME_ENDPOINT || '',
    subprotocol: '1.0.0',

    // no user specified initially
    userId: 'false',
  });

export default realtimeClient;
