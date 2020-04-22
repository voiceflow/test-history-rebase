import _last from 'lodash/last';

import SocketClient, { SocketStatus } from './client';
import { ServerEvent, SocketEvent } from './constants';
import { ActionHandler, DiagramUpdateEvent, RealtimeSubscription, SubscriptionConfig, UpdateActionHandler } from './types';

const HEARTBEAT_TIMEOUT = 1000;

const createSubscription = (
  tabID: string,
  client: SocketClient,
  sendHeartbeat: () => void,
  { onReload, onDisconnect, onReconnect, updateTimestamp, handleSessionTakeOver, handleSessionTaken }: SubscriptionConfig
) => {
  const handlers: Record<string, ActionHandler[]> = {};
  const updateHandlers: UpdateActionHandler[] = [];
  const teardownHandlers: (() => void)[] = [];

  const handleUpdate = (data: DiagramUpdateEvent) => {
    if (data.timestamp) {
      updateTimestamp(data.timestamp);
    }

    // ignore our own events
    if (data.tabId === tabID) return;

    const { type } = data.action;
    const eventHandlers = type.startsWith('REALTIME:SOCKET:') || type.startsWith('REALTIME:PROJECT:SOCKET:') ? updateHandlers : handlers[type] || [];

    eventHandlers.forEach((handler) => handler(data.action, data.tabId));
  };

  const handleVolatile = (data: DiagramUpdateEvent) => {
    // ignore our own events
    if (data.tabId === tabID) return;

    updateHandlers.forEach((handler) => handler(data.action, data.tabId, { volatile: true }));
  };

  const handleRecover = (updates: string[]) => {
    const { timestamp: lastTimestamp } = JSON.parse(_last(updates)!) as DiagramUpdateEvent;

    if (lastTimestamp) {
      updateTimestamp(lastTimestamp);
    }

    updates.forEach((dataStr) => {
      const dataObj = JSON.parse(dataStr) as DiagramUpdateEvent;
      handleUpdate({ tabId: dataObj.tabId, action: dataObj.action });
    });
  };

  function handleReconnect() {
    client.status = SocketStatus.AUTHENTICATED;

    onReconnect();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    client.once(SocketEvent.CONNECT_ERROR, handleDisconnect);
  }

  function handleDisconnect() {
    client.status = SocketStatus.RECONNECTING;

    onDisconnect();

    client.once(SocketEvent.RECONNECT, handleReconnect);
  }

  function handleFailure(error?: { code?: number }) {
    if (client.status !== SocketStatus.TRANSFERRING && typeof error === 'object' && (error?.code ?? 0 >= 400)) {
      client.status = SocketStatus.TERMINATED;

      onDisconnect();
    }
  }

  client.on(SocketEvent.FAIL, handleFailure);
  client.on(ServerEvent.UPDATE_DIAGRAM, handleUpdate);
  client.on(ServerEvent.VOLATILE_UPDATE_DIAGRAM, handleVolatile);
  client.on(ServerEvent.DIAGRAM_RECOVER, handleRecover);
  client.once(ServerEvent.DIAGRAM_REFRESH, onReload);
  client.once(ServerEvent.SESSION_TAKEOVER, handleSessionTakeOver);
  client.once(ServerEvent.SESSION_TAKEN, handleSessionTaken);
  client.once(SocketEvent.CONNECT_ERROR, handleDisconnect);

  teardownHandlers.push(() => client.off(ServerEvent.DIAGRAM_REFRESH, onReload));
  teardownHandlers.push(() => client.off(ServerEvent.UPDATE_DIAGRAM, handleUpdate));
  teardownHandlers.push(() => client.off(ServerEvent.VOLATILE_UPDATE_DIAGRAM, handleVolatile));
  teardownHandlers.push(() => client.off(ServerEvent.DIAGRAM_RECOVER, handleRecover));
  teardownHandlers.push(() => client.off(SocketEvent.CONNECT_ERROR, handleDisconnect));
  teardownHandlers.push(() => client.off(SocketEvent.RECONNECT, handleReconnect));

  const heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_TIMEOUT);
  teardownHandlers.push(() => clearInterval(heartbeatInterval));

  return {
    on: (event, callback: ActionHandler) => {
      handlers[event] = [...(handlers[event] || []), callback];
    },

    onUpdate: (callback: UpdateActionHandler) => {
      updateHandlers.push(callback);

      return () => updateHandlers.includes(callback) && updateHandlers.splice(updateHandlers.indexOf(callback), 1);
    },

    destroy: () => teardownHandlers.forEach((callback) => callback()),
  } as RealtimeSubscription;
};

export default createSubscription;
