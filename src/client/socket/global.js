function createGlobalSocketClient(client) {
  return {
    initialize(handlers) {
      this.handlers = handlers;
    },

    subscribe() {
      Object.keys(this.handlers).forEach((eventName) => client.on(eventName, this.handlers[eventName]));
    },

    unsubscribe() {
      Object.keys(this.handlers).forEach((eventName) => client.off(eventName, this.handlers[eventName]));
    },
  };
}

export default createGlobalSocketClient;
