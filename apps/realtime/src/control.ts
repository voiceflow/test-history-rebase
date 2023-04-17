/* eslint-disable max-classes-per-file */
import { AbstractControl as BaseAbstractControl, AbstractLoguxControl as BaseAbstractLoguxControl, SocketServer } from '@voiceflow/socket-utils';
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
}

export abstract class AbstractControl extends BaseAbstractControl<ControlOptions> {}

export interface IOControlOptions extends ControlOptions {
  ioServer: IOServer;
}

export interface LoguxControlOptions extends ControlOptions {
  server: SocketServer;
  actions: ActionMap;
  channels: ChannelMap;
}

export abstract class AbstractLoguxControl extends BaseAbstractLoguxControl<LoguxControlOptions> {}
