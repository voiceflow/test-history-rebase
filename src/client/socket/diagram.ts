import { LockAction, LockType } from '@/ducks/realtime/constants';
import { LockPayload } from '@/ducks/realtime/socket';
import { RealtimeLocks } from '@/ducks/realtime/types';
import { AnyAction } from '@/store/types';
import { Callback, Function } from '@/types';

import client, { SocketStatus } from './client';
import { ClientEvent, ServerEvent } from './constants';
import { DiagramUpdateEvent } from './types';

const diagramSocketClient = {
  initialize(skillID: string, diagramID: string) {
    const handlers: Callback[] = [];

    return new Promise<WithOptional<RealtimeLocks, 'users'>>((resolve, reject) => {
      // once this is received, we can choose to take over the session
      handlers.push(client.watchOnce(ServerEvent.SESSION_BUSY, reject));

      // once this is receive user will get prompt to upgrade plan
      handlers.push(client.watchOnce(ServerEvent.WORKSPACE_PLAN_DENIED, reject));

      // once this is received, we have the ability to modify the diagram
      handlers.push(client.watchOnce(ServerEvent.INITIALIZE_DIAGRAM, resolve));

      // expect a `diagram:init` event to be sent in return
      client.emit(ClientEvent.CONNECT_DIAGRAM, {
        skillId: skillID,
        diagramId: diagramID,
      });
    }).finally(() => handlers.forEach((teardown) => teardown()));
  },

  sendUpdate(
    action: AnyAction,
    lastTimestamp: number,
    lock: LockPayload<string, LockType, LockAction> | null = null,
    serverAction: object | null = null
  ) {
    if (!client.isConnected) return Promise.resolve();

    return client.call(ClientEvent.UPDATE_DIAGRAM, {
      action,
      lastTimestamp,
      lock,
      serverAction,
    });
  },

  sendVolatileUpdate(action: AnyAction) {
    if (!client.isConnected) return;

    client.emit(ClientEvent.VOLATILE_UPDATE_DIAGRAM, { action });
  },

  sendHeartbeat() {
    if (!client.isConnected) return;

    client.emit(ClientEvent.DIAGRAM_HEARTBEAT);
  },

  watchForceRefresh(callback: Callback) {
    return client.watchOnce(ServerEvent.DIAGRAM_REFRESH, callback);
  },

  watchForUpdate(callback: Function<[DiagramUpdateEvent]>) {
    return client.watch(ServerEvent.UPDATE_DIAGRAM, callback);
  },

  watchForVolatileUpdate(callback: Function<[DiagramUpdateEvent]>) {
    return client.watch(ServerEvent.VOLATILE_UPDATE_DIAGRAM, callback);
  },

  watchForRecover(callback: Function<[string[]]>) {
    return client.watch(ServerEvent.DIAGRAM_RECOVER, callback);
  },

  terminate(skillId: string, diagramId: string) {
    return client.call(ClientEvent.LEAVE_DIAGRAM, { skillId, diagramId });
  },

  async switch(skillID: string, diagramID: string) {
    const prevStatus = client.status;
    client.status = SocketStatus.TRANSFERRING;

    await this.terminate(skillID, diagramID);

    const locks = await this.initialize(skillID, diagramID);

    client.status = prevStatus;

    return locks;
  },
};

export default diagramSocketClient;
