import { LockAction, LockType } from '@/ducks/realtime/constants';
import { LockPayload } from '@/ducks/realtime/socket';
import { RealtimeLocks } from '@/ducks/realtime/types';
import { AnyAction } from '@/store/types';

import SocketClient, { SocketStatus } from './client';
import { ClientEvent, ServerEvent } from './constants';
import createSubscription from './subscription';
import { SubscriptionConfig } from './types';

function createRealtimeSocketClient(client: SocketClient) {
  return {
    initialize(skillID: string, diagramID: string) {
      return new Promise<WithOptional<RealtimeLocks, 'users'>>((resolve, reject) => {
        // once this is received, we can choose to take over the seesion
        client.once(ServerEvent.SESSION_BUSY, reject);

        // once this is receive user will get prompt to upgrade plan
        client.once(ServerEvent.WORKSPACE_PLAN_DENIED, reject);

        // once this is received, we have the ability to modify the diagram
        client.once(ServerEvent.INITIALIZE_DIAGRAM, resolve);

        // expect a `diagram:init` event to be sent in return
        client.emit(ClientEvent.CONNECT_DIAGRAM, {
          skillId: skillID,
          diagramId: diagramID,
        });
      });
    },

    sendProjectUpdate(action: AnyAction, lastTimestamp: number, lock: LockPayload<string, LockType, LockAction> | null = null) {
      if (!client.isConnected) return;

      return new Promise((resolve) => {
        client.once(ServerEvent.PROJECT_UPDATED, resolve);

        client.emit(ClientEvent.UPDATE_PROJECT, {
          action,
          lastTimestamp,
          lock,
        });
      });
    },

    sendUpdate(
      action: AnyAction,
      lastTimestamp: number,
      lock: LockPayload<string, LockType, LockAction> | null = null,
      serverAction: object | null = null
    ) {
      if (!client.isConnected) return;

      return new Promise((resolve) => {
        client.once(ServerEvent.DIAGRAM_UPDATED, resolve);

        client.emit(ClientEvent.UPDATE_DIAGRAM, {
          action,
          lastTimestamp,
          lock,
          serverAction,
        });
      });
    },

    sendVolatileUpdate(action: AnyAction) {
      if (client.isConnected) {
        client.emit(ClientEvent.VOLATILE_UPDATE_DIAGRAM, { action });
      }
    },

    initiateSessionTakeOver() {
      if (client.isConnected) {
        // new client will send this action
        client.emit(ClientEvent.TAKEOVER_SESSION);
      }
    },

    createSubscription(tabID: string, config: SubscriptionConfig) {
      return createSubscription(tabID, client, this.sendHeartbeat, config);
    },

    sendHeartbeat: () => {
      if (client.isConnected) {
        client.emit(ClientEvent.DIAGRAM_HEARTBEAT);
      }
    },

    terminate() {
      client.emit(ClientEvent.LEAVE_DIAGRAM);

      return new Promise((resolve) => client.once(ServerEvent.DIAGRAM_LEFT, resolve));
    },

    async switch(skillID: string, diagramID: string) {
      const prevStatus = client.status;
      client.status = SocketStatus.TRANSFERRING;

      await this.terminate();

      const locks = await this.initialize(skillID, diagramID);

      client.status = prevStatus;

      return locks;
    },
  };
}

export default createRealtimeSocketClient;
