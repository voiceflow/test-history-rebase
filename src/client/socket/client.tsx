import moize from 'moize';
import io from 'socket.io-client';

import { API_ENDPOINT, DEBUG_SOCKET, DEVICE_INFO } from '@/config';

import { clientLogger } from '../utils';
import { AnySocketEvent, CALL_MAP, SocketEvent } from './constants';

declare global {
  interface Window {
    store?: unknown;
  }
}

const SOCKET_INIT_TIMEOUT = 3000;
const SOCKET_CONNECTION_TIMEOUT = 5000;
const SOCKET_REPLY_TIMEOUT = 5000;

const log = clientLogger.child('socket');

const createDebugSubscription = moize((event, callback) => (data: any) => {
  log.debug('received socket event', log.value(event));
  log.debug('data', log.value(data));

  callback(data);
});

function debugEmit(event: string, data: any) {
  log.debug('emitting socket event', log.value(event));
  log.debug('data', log.value(data));
}

export enum SocketStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  RECONNECTING = 'reconnecting',
  CONNECTED = 'connected',
  TERMINATED = 'terminated',
  TRANSFERRING = 'transferring',
}

type AuthProfile = {
  auth: string | undefined;
  browserId: string;
  tabId: string;
  device: typeof DEVICE_INFO;
};

class SocketClient {
  socket = io(API_ENDPOINT, {
    autoConnect: false,
    timeout: SOCKET_CONNECTION_TIMEOUT,
    // do not allow downgrading to HTTP
    transports: ['websocket'],
  });

  status = SocketStatus.DISCONNECTED;

  authProfile: AuthProfile | null = null;

  get isConnected() {
    return this.status === SocketStatus.CONNECTED;
  }

  constructor() {
    window.addEventListener('beforeunload', this.disconnect);
  }

  // re-expose socket methods with debugging

  on = <T extends any = void>(event: AnySocketEvent, callback: (value: T) => void) => {
    if (DEBUG_SOCKET) {
      log.warn('adding socket subscription', log.value(event));
    }

    this.socket.on(event, DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback);
  };

  once = <T extends any = void>(event: AnySocketEvent, callback: (value: T) => void) => {
    if (DEBUG_SOCKET) {
      log.warn('adding one-time socket subscription', log.value(event));
    }

    this.socket.once(event, DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback);
  };

  off = (event: AnySocketEvent, callback: ((value?: any) => void) | undefined = undefined) => {
    if (DEBUG_SOCKET) {
      log.warn('removing socket subscription', log.value(event));
    }

    this.socket.off(event, callback && (DEBUG_SOCKET ? createDebugSubscription(event, callback) : callback));
  };

  watch = <T extends any = void>(event: AnySocketEvent, callback: (value: T) => void) => {
    this.on(event, callback);

    return () => this.off(event, callback);
  };

  watchOnce = <T extends any = void>(event: AnySocketEvent, callback: (value: T) => void) => {
    this.once(event, callback);

    return () => this.off(event, callback);
  };

  call = (event: keyof typeof CALL_MAP, data?: any, timeout = SOCKET_REPLY_TIMEOUT) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        this.off(CALL_MAP[event], resolve);
        reject();
      }, timeout);

      this.once(CALL_MAP[event], resolve);

      return this.emit(event, data);
    });

  emit = (event: string, data?: any) => {
    if (DEBUG_SOCKET) {
      debugEmit(event, data);
    }

    this.socket.emit(event, data);
  };

  // lifecycle methods

  connect = () => {
    if (this.socket.connected) return Promise.resolve();

    this.status = SocketStatus.CONNECTING;

    // log socket error events
    this.#setupErrorHandlers();

    return new Promise((resolve) => {
      this.once(SocketEvent.CONNECT, () => {
        this.status = SocketStatus.CONNECTED;

        this.on(SocketEvent.DISCONNECT, () => {
          this.status = SocketStatus.DISCONNECTED;
        });

        resolve();
      });

      this.socket.connect();
    });
  };

  disconnect = () => {
    if (!this.socket.connected) return;

    this.status = SocketStatus.TERMINATED;
    this.socket.disconnect();
  };

  auth = async (authToken: string, browserID: string, tabID: string) => {
    const authProfile = {
      auth: authToken || undefined,
      browserId: browserID,
      tabId: tabID,
      device: DEVICE_INFO,
    };

    try {
      await this.#initializeConnection(authProfile);

      this.on(SocketEvent.RECONNECT, () => this.#initializeConnection());

      this.authProfile = authProfile;
    } catch {
      log.error('Unable to connect to Voiceflow');
    }
  };

  #initializeConnection = (authProfile = this.authProfile) => this.call(SocketEvent.INITIALIZE, authProfile!, SOCKET_INIT_TIMEOUT);

  #setupErrorHandlers = () => {
    this.#handleError(SocketEvent.FAIL);
    this.#handleError(SocketEvent.ERROR);
    // to catch if the server is offline
    this.#handleError(SocketEvent.CONNECT_ERROR);
    // catch failed connection attempts
    this.#handleError(SocketEvent.CONNECT_FAILED);
  };

  #handleError = (event: SocketEvent) => this.on(event, (data) => log.error('socket failure from event', log.value(event), data));
}

export default new SocketClient();
