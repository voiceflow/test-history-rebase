import { Logger } from '@voiceflow/logger';
import { AbstractControl as BaseAbstractControl, SocketServer } from '@voiceflow/socket-utils';
import { Server as IOServer } from 'socket.io';

import type { ActionMap } from './actions';
import type { ChannelMap } from './channels';
import type { ClientMap } from './clients';
import type { ModelMap } from './models';
import type { ServiceMap } from './services';
import type { Config } from './types';

export interface ControlOptions {
  config: Config;
  clients: ClientMap;
  models: ModelMap;
  services: ServiceMap;
  log: Logger;
}

export abstract class AbstractControl extends BaseAbstractControl<ControlOptions> {
  protected log: Logger;

  constructor(options: ControlOptions) {
    super(options);
    this.log = options.log;
  }
}

export interface IOControlOptions extends ControlOptions {
  ioServer: IOServer;
}

export interface LoguxControlOptions extends ControlOptions {
  server: SocketServer;
  actions: ActionMap;
  channels: ChannelMap;
  log: Logger;
}
