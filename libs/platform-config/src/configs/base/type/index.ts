import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { ProjectType } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

import * as Adapters from '../adapters';
import * as Common from './common';

export * as Common from './common';

export interface Config extends Common.Config {
  type: ProjectType;

  adapters: Adapters.Config;
}

export const CONFIG = Types.satisfies<Config>()({
  ...Common.CONFIG,

  type: ProjectType.VOICE,

  adapters: Adapters.CONFIG,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
