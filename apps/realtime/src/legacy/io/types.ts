/* eslint-disable max-classes-per-file */
import type { EmptyObject } from '@voiceflow/common';
import type { IO } from '@voiceflow/realtime-sdk/backend';
import type { User } from '@voiceflow/socket-utils';
import type { Socket as IOSocket } from 'socket.io';

import type { IOControlOptions } from '../control';

export interface AuthorizedCtx {
  user: User;
  token: string;
}

export interface Socket<Ctx extends EmptyObject = EmptyObject> extends IOSocket {
  ctx: Ctx;
}

export interface AuthorizedSocket<Ctx extends EmptyObject = EmptyObject> extends IOSocket {
  ctx: AuthorizedCtx & Ctx;
}

export abstract class AbstractControl {
  io: IOControlOptions['ioServer'];

  config: IOControlOptions['config'];

  clients: IOControlOptions['clients'];

  services: IOControlOptions['services'];

  constructor(options: IOControlOptions) {
    this.io = options.ioServer;
    this.config = options.config;
    this.clients = options.clients;
    this.services = options.services;
  }
}

export abstract class AbstractEvent<
  Ctx extends EmptyObject = EmptyObject,
  Data extends EmptyObject = EmptyObject,
> extends AbstractControl {
  abstract event: IO.Event;

  abstract handle(socket: Socket<Ctx>, data: Partial<Data>): Promise<void>;
}

export interface MiddlewareNext {
  (error?: Error): void;
}

export abstract class AbstractMiddleware<Ctx extends EmptyObject = EmptyObject> extends AbstractControl {
  abstract handle(socket: Socket<Ctx>, next: MiddlewareNext): Promise<void>;
}
