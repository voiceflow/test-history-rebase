import { DBWorkspace } from '@/models';
import { AnyFunction, Callback } from '@/types';

import client, { SocketStatus } from './client';
import { ServerEvent, SocketEvent } from './constants';

const globalSocketClient = {
  watchForceRefresh: (handler: Callback) => client.watchOnce(ServerEvent.FORCE_REFRESH, handler),

  watchWorkspaceMembers: (handler: (payload: { workspaceID: string; members: DBWorkspace.Member[] }) => void) =>
    client.watch(ServerEvent.WORKSPACE_MEMBERS_UPDATE, handler),

  watchForMembershipRevoked: (handler: (payload: { workspaceId: string; workspaceName: string }) => void) =>
    client.watch(ServerEvent.WORKSPACE_MEMBERSHIP_REVOKED, handler),

  watchForReconnected: (handler: Callback) => client.watch(SocketEvent.INITIALIZE, handler),

  watchForConnectionError: (handler: Callback) => client.watch(SocketEvent.CONNECT_ERROR, handler),

  watchForPrototypeWebhook: (handler: AnyFunction) => client.watch(ServerEvent.PROTOTYPE_WEBHOOK, handler),

  handleDisconnect: (onDisconnect: Callback, onReconnect: Callback) => {
    if (client.status === SocketStatus.RECONNECTING) return;

    client.status = SocketStatus.RECONNECTING;

    onDisconnect();

    client.once(SocketEvent.INITIALIZE, () => {
      onReconnect();

      client.status = SocketStatus.CONNECTED;
    });
  },

  watchForFailure: (callback: Callback) =>
    client.watch(SocketEvent.FAIL, (error?: { code?: number }) => {
      if (client.status !== SocketStatus.TRANSFERRING && typeof error === 'object' && (error?.code ?? 0 >= 400)) {
        return callback();
      }
    }),
};

export default globalSocketClient;
