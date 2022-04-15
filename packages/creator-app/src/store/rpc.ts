import { Middleware, RPCHandler } from './types';

export class RPCController {
  handlers: RPCHandler[] = [];

  replaceHandlers(handlers: RPCHandler[]) {
    this.handlers = handlers;
  }

  createMiddleware(handlers: RPCHandler[]): Middleware {
    this.replaceHandlers(handlers);

    return (api) => (next) => (action) => {
      const isHandled = this.handlers.reduce((acc, handler) => handler(action, api.dispatch) || acc, false);

      if (!isHandled) {
        // eslint-disable-next-line callback-return
        next(action);
      }
    };
  }
}
