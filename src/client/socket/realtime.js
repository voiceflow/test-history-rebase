import _ from 'lodash';

import { SocketStatus } from './client';

const HEARTBEAT_TIMEOUT = 1000;

function createRealtimeSocketClient(client) {
  return {
    initialize(skillID, diagramID) {
      return new Promise((resolve, reject) => {
        // once this is received, we can choose to take over the seesion
        client.once('session:busy', reject);

        // once this is received, we have the ability to modify the diagram
        client.once('diagram:init', resolve);

        // expect a `diagram:init` event to be sent in return
        client.emit('diagramConnect', {
          skillId: skillID,
          diagramId: diagramID,
        });
      });
    },

    sendProjectUpdate(action, lastTimestamp, lock = null) {
      return new Promise((resolve) => {
        client.once('project:updated', resolve);

        client.emit('projectUpdate', {
          action,
          lastTimestamp,
          lock,
        });
      });
    },

    sendUpdate(action, lastTimestamp, lock = null, serverAction = null) {
      return new Promise((resolve) => {
        client.once('diagram:updated', resolve);

        client.emit('diagramUpdate', {
          action,
          lastTimestamp,
          lock,
          serverAction,
        });
      });
    },

    sendVolatileUpdate(action) {
      client.emit('diagramVolatile', { action });
    },

    initiateSessionTakeOver() {
      // new client will send this action
      client.emit('sessionTakeover');
    },

    createSubscription(tabID, { onReload, onDisconnect, onReconnect, updateTimestamp, handleSessionTakeOver, handleSessionTaken }) {
      const handlers = {};
      const updateHandlers = [];
      const teardownHandlers = [];

      const handleUpdate = (data) => {
        if (data.timestamp) {
          updateTimestamp(data.timestamp);
        }

        // ignore our own events
        if (data.tabId === tabID) return;

        const { type } = data.action;
        const eventHandlers =
          type.startsWith('REALTIME:SOCKET:') || type.startsWith('REALTIME:PROJECT:SOCKET:') ? updateHandlers : handlers[type] || [];

        eventHandlers.forEach((handler) => handler(data.action, data.tabId));
      };

      const handleVolatile = (data) => {
        // ignore our own events
        if (data.tabId === tabID) return;

        updateHandlers.forEach((handler) => handler(data.action, data.tabId));
      };

      const handleRecover = (updates) => {
        /**
         * property "update" will be of the shape:
         * [
         *  "{
         *   "action": {},
         *   "tabId",
         *   "timestamp",
         *   }"
         * ]
         */
        const lastTimestamp = JSON.parse(_.last(updates)).timestamp; // getting the last timestamp

        if (lastTimestamp) {
          updateTimestamp(lastTimestamp);
        }

        updates.forEach((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          handleUpdate({ tabId: dataObj.tabId, action: dataObj.action });
        });
      };

      function handleReconnect() {
        client.status = SocketStatus.AUTHENTICATED;

        onReconnect();

        client.once('connect_error', handleDisconnect);
      }

      function handleDisconnect() {
        client.status = SocketStatus.RECONNECTING;

        onDisconnect();

        client.once('reconnect', handleReconnect);
      }

      function handleFailure(error) {
        if (typeof error === 'object' && (error?.code ?? 0 >= 400)) {
          client.status = SocketStatus.TERMINATED;

          onDisconnect();
        }
      }

      client.on('fail', handleFailure);
      client.on('diagram:update', handleUpdate);
      client.on('diagram:volatile', handleVolatile);
      client.on('diagram:recover', handleRecover);
      client.once('diagram:refresh', onReload);
      client.once('session:takeover', handleSessionTakeOver);
      client.once('session:taken', handleSessionTaken);
      client.once('connect_error', handleDisconnect);

      teardownHandlers.push(() => client.off('diagram:refresh', onReload));
      teardownHandlers.push(() => client.off('diagram:update', handleUpdate));
      teardownHandlers.push(() => client.off('diagram:volatile', handleVolatile));
      teardownHandlers.push(() => client.off('diagram:recover', handleRecover));
      teardownHandlers.push(() => client.off('connect_error', handleDisconnect));
      teardownHandlers.push(() => client.off('reconnect', handleReconnect));

      const heartbeatInterval = setInterval(this.sendHeartbeat, HEARTBEAT_TIMEOUT);
      teardownHandlers.push(() => clearInterval(heartbeatInterval));

      return {
        on: (event, callback) => {
          handlers[event] = [...(handlers[event] || []), callback];
        },
        onUpdate: (callback) => {
          updateHandlers.push(callback);

          return () => updateHandlers.includes(callback) && updateHandlers.splice(updateHandlers.indexOf(callback), 1);
        },
        destroy: () => teardownHandlers.forEach((callback) => callback()),
      };
    },

    sendHeartbeat() {
      if (client.isConnected) {
        client.emit('diagramHeartbeat');
      }
    },

    terminate() {
      client.emit('diagramLeave');

      return new Promise((resolve) => client.once('diagram:left', resolve));
    },

    async switch(skillID, diagramID) {
      await this.terminate();

      return this.initialize(skillID, diagramID);
    },
  };
}

export default createRealtimeSocketClient;
