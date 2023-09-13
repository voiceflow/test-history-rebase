import { Logger } from '@voiceflow/logger';
import { AbstractServiceManager, ServiceManagerOptions } from '@voiceflow/socket-utils';

import buildActions, { ActionMap } from './actions';
import buildChannels, { ChannelMap } from './channels';
import buildClients, { ClientMap, stopClients } from './clients';
import type { IOControlOptions, LoguxControlOptions } from './control';
import buildIO from './io';
import buildMiddlewares, { MiddlewareMap } from './middlewares';
import buildModels, { ModelMap } from './models';
import buildServices, { ServiceMap } from './services';
import type { Config } from './types';

interface Options extends ServiceManagerOptions<LoguxControlOptions['config']> {
  ioServer: IOControlOptions['ioServer'];
}

class ServiceManager extends AbstractServiceManager<LoguxControlOptions, MiddlewareMap> {
  constructor({ ioServer, ...options }: Options) {
    super(options);

    buildIO({
      config: options.config,
      clients: this.clients,
      models: this.models,
      ioServer,
      services: this.services,
    });
  }

  buildClients(context: { config: Config; log: Logger }): ClientMap {
    return buildClients(context);
  }

  buildServices(context: { config: Config; clients: ClientMap; log: Logger; models: ModelMap }): ServiceMap {
    return buildServices(context);
  }

  buildModels(context: { config: Config; clients: ClientMap }): ModelMap {
    return buildModels(context);
  }

  buildMiddlewares(context: LoguxControlOptions): MiddlewareMap {
    return buildMiddlewares(context);
  }

  buildActions(context: LoguxControlOptions): ActionMap {
    return buildActions(context);
  }

  buildChannels(context: LoguxControlOptions): ChannelMap {
    return buildChannels(context);
  }

  async stop(): Promise<void> {
    await Promise.allSettled([super.stop(), stopClients(this.clients)]);
  }
}

export default ServiceManager;
