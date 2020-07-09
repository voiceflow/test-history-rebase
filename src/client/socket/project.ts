import { LockAction, LockType } from '@/ducks/realtime/constants';
import { LockPayload } from '@/ducks/realtime/socket';
import { AnyAction } from '@/store/types';
import { Callback, Function } from '@/types';

import client from './client';
import { ClientEvent, ServerEvent } from './constants';

const projectSocketClient = {
  initialize(projectID: string) {
    return client.call(ClientEvent.CONNECT_PROJECT, { projectId: projectID });
  },

  sendUpdate(action: AnyAction, lastTimestamp: number, lock: LockPayload<string, LockType, LockAction> | null = null) {
    if (!client.isConnected) return Promise.resolve();

    return client.call(ClientEvent.UPDATE_PROJECT, {
      action,
      lastTimestamp,
      lock,
    });
  },

  takeoverSession() {
    if (!client.isConnected) return;

    client.emit(ClientEvent.TAKEOVER_SESSION);
  },

  watchForSessionTerminated(callback: Function<[{ browserID: string }]>) {
    return client.watchOnce(ServerEvent.SESSION_TERMINATED, callback);
  },

  watchForSessionAcquired(callback: Callback) {
    return client.watchOnce(ServerEvent.SESSION_ACQUIRED, callback);
  },
};

export default projectSocketClient;
