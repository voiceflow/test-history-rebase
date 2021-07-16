/* eslint-disable max-classes-per-file */
import type { ActionMap } from './actions';
import type { ChannelMap } from './channels';
import type { ClientMap } from './clients';
import type Server from './server';
import type { ServiceMap } from './services';
import type { Config } from './types';

export interface ControlOptions {
  config: Config;
  clients: ClientMap;
  services: ServiceMap;
}

export abstract class AbstractControl {
  protected config: Config;

  protected clients: ClientMap;

  protected services: ServiceMap;

  constructor({ config, clients, services }: ControlOptions) {
    this.config = config;
    this.clients = clients;
    this.services = services;
  }
}

export interface LoguxControlOptions extends ControlOptions {
  server: Server;
  actions: ActionMap;
  channels: ChannelMap;
}

export abstract class AbstractLoguxControl extends AbstractControl {
  protected server: Server;

  protected actions: ActionMap;

  protected channels: ChannelMap;

  constructor({ server, actions, channels, ...options }: LoguxControlOptions) {
    super(options);

    this.server = server;
    this.actions = actions;
    this.channels = channels;
  }

  abstract setup(): void | Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  destroy(): void | Promise<void> {}
}
