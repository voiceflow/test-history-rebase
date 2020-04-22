import Markdown from 'markdown-to-jsx';
import moize from 'moize';
import React from 'react';
import io from 'socket.io-client';

import { API_ENDPOINT, DEBUG_SOCKET, DEVICE_INFO } from '@/config';
import { setConfirm } from '@/ducks/modal';
import { Dispatch } from '@/store/types';

import { ServerEvent, SocketEvent } from './constants';

declare global {
  interface Window {
    store?: unknown;
  }
}

const BOLD_FONT_STYLE = 'font-weight: bold';
const NORMAL_FONT_STYLE = 'font-weight: normal';

const SOCKET_INIT_TIMEOUT = 3000;
const SOCKET_CONNECTION_TIMEOUT = 5000;

/* eslint-disable no-console */
const createDebugSubscription = moize((event, callback) => (data: any) => {
  console.warn(`received socket event %c${event}`, BOLD_FONT_STYLE);
  if (typeof data === 'string') {
    console.warn(`%cdata: "%c%${data}%c"`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE, BOLD_FONT_STYLE);
  } else if (data) {
    console.warn('%cdata:', BOLD_FONT_STYLE, data);
  }

  callback(data);
});

function debugEmit(event: string, data: any) {
  console.warn(`emitting socket event %c${event}`, BOLD_FONT_STYLE);
  if (typeof data === 'string') {
    console.warn(`%cdata: "%c%${data}%c"`, BOLD_FONT_STYLE, NORMAL_FONT_STYLE, BOLD_FONT_STYLE);
  } else if (data) {
    console.warn('%cdata:', BOLD_FONT_STYLE, data);
  }
}
/* eslint-enable no-console */

export enum SocketStatus {
  CONNECTING = 'connecting',
  RECONNECTING = 'reconnecting',
  CONNECTED = 'connected',
  AUTHENTICATED = 'authenticated',
  TERMINATED = 'terminated',
  TRANSFERRING = 'transferring',
}

const CONNECTED_STATUSES = [SocketStatus.CONNECTED, SocketStatus.AUTHENTICATED];

class SocketClient {
  socket = io(API_ENDPOINT, {
    autoConnect: false,
    timeout: SOCKET_CONNECTION_TIMEOUT,
    // do not allow downgrading to HTTP
    transports: ['websocket'],
  });

  status = SocketStatus.CONNECTING;

  connectionHandlers: Record<string, () => void> = {};

  authProfile: {
    auth: string | undefined;
    browserId: string;
    tabId: string;
    device: typeof DEVICE_INFO;
  } | null = null;

  get isConnected() {
    return CONNECTED_STATUSES.includes(this.status);
  }

  constructor(protected dispatch: Dispatch) {
    window.addEventListener('beforeunload', this.disconnect);
  }

  // re-expose socket methods with debugging

  on = <T extends any = void>(event: string, callback: (value: T) => void) => {
    if (DEBUG_SOCKET) {
      // eslint-disable-next-line no-console
      console.warn(`adding socket subscription for %c${event}`, BOLD_FONT_STYLE);
    }

    this.socket.on(event, DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback);
  };

  once = <T extends any = void>(event: string, callback: (value: T) => void) => {
    if (DEBUG_SOCKET) {
      // eslint-disable-next-line no-console
      console.warn(`adding one-time socket subscription for %c${event}`, BOLD_FONT_STYLE);
    }

    this.socket.once(event, DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback);
  };

  off = (event: string, callback: ((value?: any) => void) | undefined = undefined) => {
    if (DEBUG_SOCKET) {
      // eslint-disable-next-line no-console
      console.warn(`removing socket subscription for %c${event}`, BOLD_FONT_STYLE);
    }

    this.socket.off(event, callback && (DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback));
  };

  emit = (event: string, data?: any) => {
    if (DEBUG_SOCKET) {
      debugEmit(event, data);
    }

    this.socket.emit(event, data);
  };

  // lifecycle methods

  // eslint-disable-next-line consistent-return
  connect = (sessionCancelHandler: () => void) => {
    if (!this.socket.connected) {
      this.setupErrorHandlers();

      this.on(ServerEvent.FORCE_REFRESH, () => window.location.reload(true));

      return new Promise((resolve) => {
        this.once(SocketEvent.CONNECT, () => {
          this.status = SocketStatus.CONNECTED;

          // not sure if we can expect further "connect" events
          this.on(SocketEvent.CONNECT, () => this.initializeConnection());

          resolve();
        });

        this.once(ServerEvent.SESSION_CANCELLED, sessionCancelHandler);

        this.socket.connect();
      });
    }

    return Promise.resolve();
  };

  auth = (authToken: string, browserID: string, tabID: string) => {
    this.authProfile = {
      auth: authToken || undefined,
      browserId: browserID,
      tabId: tabID,
      device: DEVICE_INFO,
    };

    return new Promise((resolve) => {
      const timeout = setTimeout(() => console.error('Unable to connect to Voiceflow'), SOCKET_INIT_TIMEOUT);

      this.once(SocketEvent.INITIALIZE, () => {
        this.handleConnection();
        clearTimeout(timeout);
        resolve();
      });

      this.initializeConnection();
    });
  };

  initializeConnection() {
    this.emit(SocketEvent.INITIALIZE, this.authProfile);
  }

  setupErrorHandlers() {
    const addErrorHandler = (event: string) => this.on(event, this.handleError(event));

    addErrorHandler(SocketEvent.FAIL);
    addErrorHandler(SocketEvent.ERROR);
    // to catch if the server is offline
    addErrorHandler(SocketEvent.CONNECT_ERROR);
    // catch failed connection attempts
    addErrorHandler(SocketEvent.CONNECT_FAILED);
  }

  handleConnection = () => {
    this.status = SocketStatus.AUTHENTICATED;
    // queued up events after reconnection
    Object.values(this.connectionHandlers).forEach((handler) => handler && handler());
  };

  disconnect = () => this.socket && this.socket.connected && this.socket.disconnect();

  handleError = (event: string) => () => {
    console.error(`socket failure from event "${event}"`);
  };

  handleMessage = (data: { message?: string; redirect?: string }) => {
    if (data.redirect) {
      window.location.replace(data.redirect);
      // eslint-disable-next-line xss/no-location-href-assign
      window.location.href = data.redirect;
      throw new Error('REDIRECT');
    } else if (data.message && window.store) {
      this.dispatch(
        setConfirm({
          size: 'rg',
          text: <Markdown>{data.message}</Markdown>,
        })
      );
    }
  };
}

export default SocketClient;
