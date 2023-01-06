import { LoguxControlMap, LoguxControlOptions } from '@socket-utils/control';
import type { SocketServer } from '@socket-utils/server';
import { Logger } from '@voiceflow/logger';

export interface ServiceManagerOptions<C> {
  config: C;
  server: SocketServer;
  log: Logger;
}

export abstract class AbstractServiceManager<T extends LoguxControlOptions, M extends LoguxControlMap> {
  public actions: T['actions'];

  public models: T['models'];

  public clients: T['clients'];

  public services: T['services'];

  public channels: T['channels'];

  public middlewares: M;

  protected server: T['server'];

  constructor({ config, server, log }: ServiceManagerOptions<T['config']>) {
    const clients = this.buildClients({ config, log });
    const models = this.buildModels({ config, clients, log });
    const services = this.buildServices({ config, clients, models, log });
    const actions = {} as T['actions'];
    const channels = {} as T['channels'];
    const middlewares = this.buildMiddlewares({ server, config, services, clients, actions, channels } as T);

    Object.assign(actions, this.buildActions({ server, config, services, clients, actions, channels } as T));
    Object.assign(channels, this.buildChannels({ server, config, services, clients, actions, channels } as T));

    this.models = models;
    this.server = server;
    this.actions = actions;
    this.clients = clients;
    this.channels = channels;
    this.services = services;
    this.middlewares = middlewares;
  }

  protected abstract buildClients(context: { config: T['config']; log: Logger }): T['clients'];

  protected abstract buildModels(context: { config: T['config']; clients: T['clients']; log: Logger }): T['models'];

  protected abstract buildServices(context: { config: T['config']; clients: T['clients']; models: T['models']; log: Logger }): T['services'];

  protected abstract buildMiddlewares(context: T): M;

  protected abstract buildActions(context: T): T['actions'];

  protected abstract buildChannels(context: T): T['channels'];

  /**
   * Start services
   */
  async start(): Promise<void> {
    await Promise.all(Object.values(this.clients).map((client) => client.setup?.()));
    await Promise.all(Object.values(this.models).map((model) => model.setup()));
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

    await Promise.allSettled(Object.values(this.clients).map((client) => client.destroy?.()));
    await Promise.allSettled(Object.values(this.models).map((model) => model.destroy()));
    await Promise.allSettled(Object.values(this.actions).map((action) => action.destroy()));
    await Promise.allSettled(Object.values(this.channels).map((channel) => channel.destroy()));
    await Promise.allSettled(Object.values(this.middlewares).map((middleware) => middleware.destroy()));
  }
}
