function createRealtimeSocketClient(client) {
  return {
    initialize: (skillID, diagramID) =>
      new Promise((resolve) => {
        // once this is received, we have the ability to modify the diagram
        client.on('diagram:init', ({ blocks, flows, users }) =>
          resolve({
            blocks,
            flows,
            users: Object.keys(users).reduce((acc, key) => Object.assign(acc, { [key]: JSON.parse(users[key]) }), {}),
          })
        );

        // expect a `diagram:init` event to be sent in return
        client.emit('diagram', {
          skillId: skillID,
          diagramId: diagramID,
        });
      }),

    sendUpdate: (payload, lastTimestamp) => {
      const isVolatile = !lastTimestamp;
      client.emit(isVolatile ? 'diagramVolatile' : 'diagramUpdate', {
        // TODO: handle BLOCK_BUSY and BLOCK_FREE
        type: null,
        lastTimestamp: isVolatile ? null : lastTimestamp,
        payload,
      });
    },

    moveMouse: (location) =>
      client.emit('diagramMouse', {
        type: null,
        payload: location,
      }),

    createSubscription: (tabID, updateTimestamp, onReload) => {
      const handlers = {};
      const updateHandlers = [];
      const teardownHandlers = [];

      const handleUpdate = (data) => {
        if (data.timestamp) {
          updateTimestamp(data.timestamp);
        }

        if (data.tabId === tabID) return;

        const type = data.payload.type;
        const eventHandlers = type.startsWith('REALTIME:SOCKET:') ? updateHandlers : handlers[type] || [];

        eventHandlers.forEach((handler) => handler(data.tabId, data.payload));
      };

      const handleRecover = (updates) => {
        // TODO: replay updates
        // eslint-disable-next-line no-console
        console.log('replay these updates', updates);
      };

      client.on('diagram:refresh', onReload);
      client.on('diagram:update', handleUpdate);
      client.on('diagram:recover', handleRecover);

      teardownHandlers.push(() => client.off('diagram:refresh', onReload));
      teardownHandlers.push(() => client.off('diagram:update', handleUpdate));
      teardownHandlers.push(() => client.off('diagram:recoverrefrecresh', handleRecover));

      return {
        on: (event, callback) => {
          handlers[event] = [...(handlers[event] || []), callback];
        },
        onUpdate: (callback) => {
          updateHandlers.push(callback);
        },
        onMoveMouse: (callback) => {
          const handler = (data) => data.tabId !== tabID && callback(data.tabId, data.payload);
          client.on('diagram:mouse', handler);

          teardownHandlers.push(() => client.off('diagram:mouse', handler));
        },
        destroy: () => teardownHandlers.forEach((callback) => callback()),
      };
    },

    terminate: () => client.emit('leave'),
  };
}

export default createRealtimeSocketClient;
