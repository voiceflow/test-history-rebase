import SocketClient from './client';

function createGlobalSocketClient(client: SocketClient) {
  return {
    handlers: {} as Record<string, () => void>,

    initialize(handlers: Record<string, () => void>) {
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
