/* eslint-disable no-param-reassign */
import { Struct } from '@voiceflow/common';
import { LOGROCKET_ENABLED } from '@voiceflow/ui';
import LogRocket from 'logrocket';
import { Socket } from 'socket.io-client';

export interface WatchOptions {
  filter?: (name: string, args: unknown[]) => false | undefined | unknown[];
}

const event = (name: string) => `socket.io ${name}`;

const watchSocketIO = (socket: Socket, options: WatchOptions = {}): void => {
  if (!LOGROCKET_ENABLED) return;

  const emit = socket.emit.bind(socket);
  const payload = (props: Struct = {}) => ({ ...props, host: socket.io.opts.hostname });
  const logFiltered = (label: string, name: string, args: any[]) => {
    const filtered = options.filter?.(name, args) ?? args;

    if (filtered) {
      LogRocket.log(event(label), payload({ name, args: filtered }));
    }
  };

  // captures events sent by the client
  socket.emit = (name: string, ...args: unknown[]) => {
    try {
      emit(name, ...args);
    } finally {
      logFiltered('sent', name, args);
    }

    return socket;
  };

  socket.onAny((name, ...args) => logFiltered('received', name, args));

  socket.on('connect', () => LogRocket.log(event('connected'), payload()));
  socket.on('connect_error', () => LogRocket.log(event('connection error'), payload()));
  socket.on('disconnect', (reason: string) => LogRocket.log(event('disconnected'), payload({ reason })));

  socket.io.on('reconnect', (reason: string) => LogRocket.log(event('reconnect successful'), payload({ reason })));
  socket.io.on('reconnect_attempt', (attempts: number) => LogRocket.log(event('reconnect attempted'), payload({ attempts })));
  socket.io.on('reconnect_error', () => LogRocket.log(event('reconnect error'), payload()));
  socket.io.on('reconnect_failed', (error: Error) => LogRocket.log(event('reconnect failed'), payload({ error })));
};

export default watchSocketIO;
