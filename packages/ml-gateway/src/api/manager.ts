import express from 'express';

import ServiceManager from '@/serviceManager';

import config from '../config';
import type { ControllersMap } from './controllers';
import buildControllers from './controllers';
import type { MiddlewaresMap } from './middlewares';
import buildMiddlewares from './middlewares';
import buildRoutes from './routes';
import { routeWrapper } from './utils';

class ApiManager {
  private static API_NAMESPACE = 'api';

  private static API_VERSION = 'v1';

  app: express.Application = express();

  controllers: ControllersMap;

  middlewares: MiddlewaresMap;

  router: express.Router;

  serviceManager: ServiceManager;

  constructor(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
    this.controllers = this.buildControllers();
    this.middlewares = this.buildMiddlewares();
    this.router = this.buildRoutes();
  }

  private buildMiddlewares() {
    const { clients, services } = this.serviceManager;
    return buildMiddlewares(config, { clients, services });
  }

  private buildControllers() {
    const { clients, services } = this.serviceManager;
    return buildControllers(config, { clients, services });
  }

  private buildRoutes() {
    routeWrapper(this.middlewares);
    routeWrapper(this.controllers);
    return buildRoutes({ controllers: this.controllers, middlewares: this.middlewares });
  }

  start() {
    this.app.use(`/${ApiManager.API_NAMESPACE}/${ApiManager.API_VERSION}`, this.router);

    return this.app;
  }
}

export default ApiManager;
