import { LockAction, LockType } from '@/ducks/realtime/constants';
import { LockPayload } from '@/ducks/realtime/socket';
import { AnyAction } from '@/store/types';
import { AnyFunction, Callback, Function } from '@/types';

import client from './client';
import { ClientEvent, ServerEvent } from './constants';

const projectSocketClient = {
  initialize: (projectID: string) => client.call(ClientEvent.CONNECT_PROJECT, { projectId: projectID }),

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

  watchForSessionTerminated: (callback: Function<[{ browserID: string }]>) => client.watchOnce(ServerEvent.SESSION_TERMINATED, callback),

  watchForSessionAcquired: (callback: Callback) => client.watchOnce(ServerEvent.SESSION_ACQUIRED, callback),

  watchForNewThread: (callback: AnyFunction) => client.watch(ServerEvent.NEW_THREAD, callback),

  watchForThreadUpdate: (callback: AnyFunction) => client.watch(ServerEvent.THREAD_UPDATED, callback),

  watchForThreadDelete: (callback: AnyFunction) => client.watch(ServerEvent.THREAD_DELETED, callback),

  watchForNewReply: (callback: AnyFunction) => client.watch(ServerEvent.NEW_REPLY, callback),

  watchForCommentUpdate: (callback: AnyFunction) => client.watch(ServerEvent.COMMENT_UPDATED, callback),

  watchForCommentDelete: (callback: AnyFunction) => client.watch(ServerEvent.COMMENT_DELETED, callback),

  watchForTranscriptDelete: (callback: AnyFunction) => client.watch(ServerEvent.TRANSCRIPT_DELETED, callback),
};

export default projectSocketClient;
