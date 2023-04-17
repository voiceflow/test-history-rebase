import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as Intent from './intent';
import * as Prompt from './prompt';
import * as Version from './version';

export { Intent, Prompt, Version };

export const CONFIG = Base.Adapters.extend({
  intent: Intent.CONFIG,

  prompt: Prompt.CONFIG,

  version: Version.CONFIG,
})(Base.Adapters.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
