/* eslint-disable max-classes-per-file */
import type { BaseClientMap } from '@socket-utils/client';
import type { SocketServer } from '@socket-utils/server';
import type { BaseServiceMap } from '@socket-utils/service';
import { Eventual } from '@voiceflow/common';
import { AxiosError } from 'axios';

export const isAxiosError = (err: any): err is AxiosError => !!err.isAxiosError;
export const isUnauthorizedError = (err: any) => isAxiosError(err) && err.response?.status === 401;

// control map

export type LoguxControlMap = Record<string, LoguxControl>;

// abstract controls

export interface ControlOptions<C = any> {
  config: C;
  clients: BaseClientMap;
  services: BaseServiceMap;
}

export abstract class AbstractControl<T extends ControlOptions> {
  protected config: T['config'];

  protected clients: T['clients'];

  protected services: T['services'];

  constructor({ config, clients, services }: T) {
    this.config = config;
    this.clients = clients;
    this.services = services;
  }
}

export interface LoguxControl {
  setup(): Eventual<void>;
  destroy(): Eventual<void>;
}

export interface LoguxControlOptions extends ControlOptions {
  server: SocketServer;
  actions: LoguxControlMap;
  channels: LoguxControlMap;
}

export abstract class AbstractLoguxControl<T extends LoguxControlOptions> extends AbstractControl<T> implements LoguxControl {
  protected server: T['server'];

  protected actions: T['actions'];

  protected channels: T['channels'];

  constructor(options: T) {
    super(options);

    this.server = options.server;
    this.actions = options.actions;
    this.channels = options.channels;
  }

  abstract setup(): Eventual<void>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  destroy(): Eventual<void> {}
}
