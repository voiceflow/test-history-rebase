/* eslint-disable max-classes-per-file */
import type { Context } from '@logux/server';
import type { Eventual } from '@voiceflow/common';
import type { AxiosError } from 'axios';

import type { BaseClientMap } from '../client';
import type { SocketServer } from '../server';
import type { BaseServiceMap } from '../service';

export const isAxiosError = (err: any): err is AxiosError => !!err.isAxiosError;
export const isUnauthorizedError = (err: any) => isAxiosError(err) && err.response?.status === 401;

export class AsyncRejectionError<C> extends Error {
  constructor(
    message: string,
    public code?: C
  ) {
    super(message);
  }
}

// control map

export type LoguxControlMap = Record<string, LoguxControl>;

// abstract controls

export interface ControlOptions<C = any> {
  config: C;
  models: Record<string, any>;
  clients: BaseClientMap;
  services: BaseServiceMap;
}

export abstract class AbstractControl<T extends ControlOptions> {
  protected config: T['config'];

  protected models: T['models'];

  protected clients: T['clients'];

  protected services: T['services'];

  constructor({ config, clients, services, models }: T) {
    this.config = config;
    this.models = models;
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

export abstract class AbstractLoguxControl<T extends LoguxControlOptions>
  extends AbstractControl<T>
  implements LoguxControl
{
  protected server: T['server'];

  protected actions: T['actions'];

  protected channels: T['channels'];

  constructor(options: T) {
    super(options);

    this.server = options.server;
    this.actions = options.actions;
    this.channels = options.channels;
  }

  protected reject<C>(message: string, code?: C): never {
    throw new AsyncRejectionError<C>(message, code);
  }

  /**
   * validates that client subprotocol is greater or equal than the provided one
   * uses >={version} semver syntax
   */
  protected isGESubprotocol(ctx: Context<any, any>, version: string) {
    return ctx.isSubprotocol(`>=${version}`);
  }

  abstract setup(): Eventual<void>;

  destroy(): Eventual<void> {}
}
