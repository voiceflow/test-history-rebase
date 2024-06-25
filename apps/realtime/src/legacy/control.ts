import type { Logger } from '@voiceflow/logger';
import type { SocketServer } from '@voiceflow/socket-utils';
import { AbstractControl as BaseAbstractControl } from '@voiceflow/socket-utils';
import type { Server as IOServer } from 'socket.io';

import type { Config } from '@/types';

import type { ActionMap } from './actions';
import type { ChannelMap } from './channels';
import type { ClientMap } from './clients';
import type { ModelMap } from './models';
import type { ServiceMap } from './services';

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
