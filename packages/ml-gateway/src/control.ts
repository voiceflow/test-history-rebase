/* eslint-disable max-classes-per-file */
import { AbstractControl as BaseAbstractControl, AbstractLoguxControl as BaseAbstractLoguxControl, SocketServer } from '@voiceflow/socket-utils';

import type { ActionMap } from './actions';
import type { ChannelMap } from './channels';
import type { ClientMap } from './clients';
import type { ServiceMap } from './services';
import type { Config } from './types';

export interface ControlOptions {
  config: Config;
  clients: ClientMap;
  models: Record<string, never>;
  services: ServiceMap;
}

export abstract class AbstractControl extends BaseAbstractControl<ControlOptions> {}

export interface LoguxControlOptions extends ControlOptions {
  server: SocketServer;
  actions: ActionMap;
  channels: ChannelMap;
}

export abstract class AbstractLoguxControl extends BaseAbstractLoguxControl<LoguxControlOptions> {}
