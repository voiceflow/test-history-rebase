import _last from 'lodash/last';

import client from '@/client';
import { DiagramUpdateAction } from '@/client/socket/constants';
import { ActionHandler, DiagramUpdateEvent, UpdateActionHandler } from '@/client/socket/types';

interface UsersUpdate {
  users: Record<string, Record<string, string>>;
}

class RealtimeSubscription {
  handlers: Record<string, ActionHandler<any>[]> = {};

  updateHandlers: UpdateActionHandler[] = [];

  teardownHandlers: (() => void)[] = [];

  constructor(private tabID: string, private updateTimestamp: (timestamp: number) => void) {
    this.teardownHandlers.push(client.socket.diagram.watchForUpdate(this.handleUpdate));
    this.teardownHandlers.push(client.socket.diagram.watchForVolatileUpdate(this.handleVolatile));
    this.teardownHandlers.push(client.socket.diagram.watchForRecover(this.handleRecover));
  }

  private handleUpdate = (data: DiagramUpdateEvent) => {
    if (data.timestamp) {
      this.updateTimestamp(data.timestamp);
    }

    // ignore our own events
    if (data.tabId === this.tabID) return;

    const { type } = data.action;
    const eventHandlers =
      type.startsWith('REALTIME:SOCKET:') || type.startsWith('REALTIME:PROJECT:SOCKET:') ? this.updateHandlers : this.handlers[type] || [];

    eventHandlers.forEach((handler) => handler(data.action, data.tabId));
  };

  private handleVolatile = (data: DiagramUpdateEvent) => {
    // ignore our own events
    if (data.tabId === this.tabID) return;

    this.updateHandlers.forEach((handler) => handler(data.action, data.tabId, { volatile: true }));
  };

  private handleRecover = (updates: string[]) => {
    const { timestamp: lastTimestamp } = JSON.parse(_last(updates)!) as DiagramUpdateEvent;

    if (lastTimestamp) {
      this.updateTimestamp(lastTimestamp);
    }

    updates.forEach((dataStr) => {
      const dataObj = JSON.parse(dataStr) as DiagramUpdateEvent;

      this.handleUpdate({ tabId: dataObj.tabId, action: dataObj.action });
    });
  };

  on = <T extends object>(event: DiagramUpdateAction, callback: ActionHandler<T>): void => {
    this.handlers[event] = [...(this.handlers[event] || []), callback];
  };

  onUpdate = (callback: UpdateActionHandler): (() => void) => {
    this.updateHandlers.push(callback);

    return () => {
      if (this.updateHandlers.includes(callback)) {
        this.updateHandlers.splice(this.updateHandlers.indexOf(callback), 1);
      }
    };
  };

  onUsersUpdate = (callback: (users: Record<string, Record<string, string>>) => void): void =>
    this.on<UsersUpdate>(DiagramUpdateAction.USERS_UPDATE, ({ users }) => callback(users));

  destroy = (): void => {
    this.teardownHandlers.forEach((callback) => callback());
    this.teardownHandlers = [];
    this.updateHandlers = [];
    this.handlers = {};
  };
}

export default RealtimeSubscription;
