import { Logger } from '@voiceflow/logger';
import { AbstractServiceManager } from '@voiceflow/socket-utils';

import buildActions, { ActionMap } from './actions';
import buildChannels, { ChannelMap } from './channels';
import buildClients, { ClientMap } from './clients';
import type { LoguxControlOptions } from './control';
import buildMiddlewares, { MiddlewareMap } from './middlewares';
import buildServices, { ServiceMap, stopServices } from './services';
import type { Config } from './types';

class ServiceManager extends AbstractServiceManager<LoguxControlOptions, MiddlewareMap> {
  buildClients(context: { config: Config; log: Logger }): ClientMap {
    return buildClients(context);
  }

  buildServices(context: { config: Config; clients: ClientMap; log: Logger }): ServiceMap {
    return buildServices(context);
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

  buildModels() {
    return {};
  }

  async start(): Promise<void> {
    await super.start();
    await this.services.configuration.start(this.server.nodeId);
  }

  async stop(): Promise<void> {
    await Promise.all([super.stop(), stopServices(this.services)]);
  }
}

export default ServiceManager;
