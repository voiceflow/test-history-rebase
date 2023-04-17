import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as Intent from './intent';
import * as Prompt from './prompt';

export { Intent, Prompt };

export const CONFIG = Base.Utils.extend({
  prompt: Prompt.CONFIG,

  intent: Intent.CONFIG,
})(Base.Utils.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
