import { Config as ConfigUtils } from '@platform/configs/utils';
import { ProjectType } from '@platform/constants';
import { Types } from '@platform/utils';

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

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
