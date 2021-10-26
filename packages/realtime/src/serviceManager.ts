import buildActions, { ActionMap } from './actions';
import buildChannels, { ChannelMap } from './channels';
import buildClients, { ClientMap } from './clients';
import buildMiddlewares, { MiddlewareMap } from './middlewares';
import type Server from './server';
import buildServices, { ServiceMap } from './services';
import type { Config } from './types';

interface Options {
  config: Config;
  server: Server;
}

class ServiceManager {
  public actions: ActionMap;

  public clients: ClientMap;

  public services: ServiceMap;

  public channels: ChannelMap;

  public middlewares: MiddlewareMap;

  private server: Server;

  constructor({ config, server }: Options) {
    const clients = buildClients({ config });
    const services = buildServices({ config, clients });
    const actions = {} as ActionMap;
    const channels = {} as ChannelMap;
    const middlewares = buildMiddlewares({ server, config, services, clients, actions, channels });

    Object.assign(actions, buildActions({ server, config, services, clients, actions, channels }));
    Object.assign(channels, buildChannels({ server, config, services, clients, actions, channels }));

    this.server = server;
    this.actions = actions;
    this.clients = clients;
    this.channels = channels;
    this.services = services;
    this.middlewares = middlewares;
  }

  /**
   * Start services
   */
  async start(): Promise<void> {
    await Promise.all(Object.values(this.middlewares).map((middleware) => middleware.setup()));
    await Promise.all(Object.values(this.channels).map((channel) => channel.setup()));
    await Promise.all(Object.values(this.actions).map((action) => action.setup()));

    this.services.sync.start(this.server);
  }

  /**
   * Stop services
   */
  async stop(): Promise<void> {
    this.services.sync.stop();

    await Promise.all(Object.values(this.actions).map((action) => action.destroy()));
    await Promise.all(Object.values(this.channels).map((channel) => channel.destroy()));
    await Promise.all(Object.values(this.middlewares).map((middleware) => middleware.destroy()));
  }
}

export default ServiceManager;
