import express from 'express';

import ServiceManager from '@/serviceManager';

import config from '../config';
import type { ControllersMap } from './controllers';
import buildControllers from './controllers';
import buildRoutes from './routes';
import { routeWrapper } from './utils';

class ApiManager {
  private static API_NAMESPACE = 'api';

  private static API_VERSION = 'v1';

  app: express.Application = express();

  controllers: ControllersMap;

  router: express.Router;

  serviceManager: ServiceManager;

  constructor(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
    this.controllers = this.buildControllers();
    this.router = this.buildRoutes();
  }

  private buildControllers() {
    const { clients, services } = this.serviceManager;
    return buildControllers(config, { clients, services });
  }

  private buildRoutes() {
    routeWrapper(this.controllers);
    return buildRoutes(this.controllers);
  }

  start() {
    this.app.use(`/${ApiManager.API_NAMESPACE}/${ApiManager.API_VERSION}`, this.router);

    return this.app;
  }
}

export default ApiManager;
