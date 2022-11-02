import * as Base from '@platform/configs/base';
import { Config as ConfigUtils } from '@platform/configs/utils';
import { ProjectType } from '@platform/constants';

import * as Adapters from '../adapters';

export const CONFIG = Base.Type.extend({
  name: 'Voice Assistant',

  type: ProjectType.VOICE,

  adapters: Adapters.CONFIG,

  description: 'Voice assistants can be connected to any channel or custom interface via API.',
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
