import type { NestExpressApplication } from '@nestjs/platform-express';

export const appRef = {
  _app: null as NestExpressApplication | null,

  get current(): NestExpressApplication {
    if (!this._app) {
      throw new Error('App reference not set');
    }

    return this._app;
  },

  set current(app: NestExpressApplication) {
    this._app = app;
  },
};
