import { DEVICE_INFO } from '@voiceflow/ui';
import moize from 'moize';
import { io } from 'socket.io-client';

import { API_ENDPOINT, DEBUG_SOCKET } from '@/config';
import watchSocketIO from '@/vendors/logRocket/socketIO';
import * as Sentry from '@/vendors/sentry';

import { clientLogger } from '../utils';
import { AnySocketEvent, CALL_MAP, ClientEvent, ServerEvent, SocketEvent, SocketIOEvent } from './constants';

const SOCKET_INIT_TIMEOUT = 3000;
const SOCKET_CONNECTION_TIMEOUT = 30000;
const SOCKET_REPLY_TIMEOUT = 5000;
const LOGROCKET_IGNORED_EVENTS: string[] = [ClientEvent.DIAGRAM_HEARTBEAT, ClientEvent.VOLATILE_UPDATE_DIAGRAM, ServerEvent.VOLATILE_UPDATE_DIAGRAM];

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

interface AuthProfile {
  auth: string | undefined;
  browserId: string;
  tabId: string;
  device: typeof DEVICE_INFO;
}

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
    watchSocketIO(this.socket, {
      filter: (name, args) => {
        if (LOGROCKET_IGNORED_EVENTS.includes(name)) return false;

        if (name === SocketEvent.INITIALIZE) {
          const [profile] = args as [AuthProfile | undefined];

          if (profile) {
            const { auth, ...filtered } = profile;

            return [filtered];
          }
        }

        return args;
      },
    });

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

    return new Promise<void>((resolve) => {
      this.once(SocketEvent.CONNECT, () => {
        Sentry.breadcrumb('socket', 'Connected to websocket');

        this.status = SocketStatus.CONNECTED;

        if (this.authProfile) {
          this.#initializeConnection(this.authProfile);
        }

        this.on(SocketEvent.DISCONNECT, this.#onDisconnect);

        resolve();
      });

      this.socket.connect();
    });
  };

  disconnect = () => {
    if (!this.socket.connected) return;

    Sentry.breadcrumb('socket', 'Disconnecting from websocket');

    this.status = SocketStatus.TERMINATED;
    this.off(SocketEvent.DISCONNECT, this.#onDisconnect);
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

      this.socket.io.off(SocketIOEvent.RECONNECT, this.#onReconnect);
      this.socket.io.on(SocketIOEvent.RECONNECT, this.#onReconnect);

      this.authProfile = authProfile;
    } catch (err) {
      Sentry.error(err);
    }
  };

  logout = async () => {
    this.authProfile = null;

    await this.call(SocketEvent.LOGOUT);
  };

  #onDisconnect = (reason: unknown) => {
    this.status = SocketStatus.DISCONNECTED;

    Sentry.breadcrumb('socket', 'Received disconnect event', { reason });
    log.warn(`Received disconnect event`, { reason });
  };

  #onReconnect = () => {
    if (this.authProfile) {
      Sentry.breadcrumb('socket', 'Reconnecting to websocket');
      this.#initializeConnection(this.authProfile);
    }
  };

  #initializeConnection = (authProfile: AuthProfile) => this.call(SocketEvent.INITIALIZE, authProfile, SOCKET_INIT_TIMEOUT);

  #setupErrorHandlers = () => {
    this.#handleError(SocketEvent.FAIL);
    // to catch if the server is offline
    this.#handleError(SocketEvent.CONNECT_ERROR);

    this.#handleIOError(SocketIOEvent.ERROR);
  };

  #logSocketError = (event: string, data: any) => {
    Sentry.breadcrumb('socket', `Received '${event}' error`, data as any);

    log.error('socket failure from event', log.value(event), data);
  };

  #handleError = (event: SocketEvent) => this.on(event, (data) => this.#logSocketError(event, data));

  #handleIOError = (event: SocketIOEvent) => this.socket.io.on(event, (data: any) => this.#logSocketError(event, data));
}

export default new SocketClient();
