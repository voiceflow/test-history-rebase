import { ServiceManagerOptions, SocketServer } from '@voiceflow/socket-utils';

import type { EntityService } from '@/entity/entity.service';
import type { UserService } from '@/user/user.service';

import buildActions from './actions';
import buildChannels from './channels';
import buildClients, { stopClients } from './clients';
import type { IOControlOptions, LoguxControlOptions } from './control';
import buildIO from './io';
import buildModels from './models';
import buildServices from './services';

interface Options extends ServiceManagerOptions<LoguxControlOptions['config']> {
  ioServer: IOControlOptions['ioServer'];
  injectedServices: {
    user: UserService;
    entity: EntityService;
  };
}

class ServiceManager {
  public actions: LoguxControlOptions['actions'];

  public models!: LoguxControlOptions['models'];

  public clients!: LoguxControlOptions['clients'];

  public services!: LoguxControlOptions['services'];

  public channels: LoguxControlOptions['channels'];

  protected server: SocketServer;

  constructor({ ioServer, ...options }: Options) {
    const { config, log, server, injectedServices } = options;

    const clients = buildClients({ config, log });
    const models = buildModels({ config, clients });
    const services = buildServices({ config, clients, models, log, injectedServices });
    const actions = {} as LoguxControlOptions['actions'];
    const channels = {} as LoguxControlOptions['channels'];

    Object.assign(actions, buildActions({ server, config, services, clients, actions, channels } as LoguxControlOptions));
    Object.assign(channels, buildChannels({ server, config, services, clients, actions, channels } as LoguxControlOptions));

    this.models = models;
    this.server = server;
    this.actions = actions;
    this.clients = clients;
    this.channels = channels;
    this.services = services;

    buildIO({
      config: options.config,
      clients: this.clients,
      models: this.models,
      ioServer,
      services: this.services,
      log,
    });
  }

  /**
   * Start services
   */
  async start(): Promise<void> {
    await Promise.all(Object.values(this.clients).map((client) => client.setup?.()));
    await Promise.all(Object.values(this.models).map((model) => model.setup()));
    await Promise.all(Object.values(this.channels).map((channel) => channel.setup()));
    await Promise.all(Object.values(this.actions).map((action) => action.setup()));
  }

  /**
   * Stop services
   */
  async stop(): Promise<void> {
    await Promise.allSettled(Object.values(this.clients).map((client) => client.destroy?.()));
    await Promise.allSettled(Object.values(this.models).map((model) => model.destroy()));
    await Promise.allSettled(Object.values(this.actions).map((action) => action.destroy()));
    await Promise.allSettled(Object.values(this.channels).map((channel) => channel.destroy()));
    await stopClients(this.clients);
  }
}

export default ServiceManager;
