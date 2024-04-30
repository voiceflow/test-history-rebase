import { Config as ConfigUtils } from '@/configs/utils';

import * as Intent from './intent';
import * as Prompt from './prompt';
import * as Version from './version';

export { Intent, Prompt, Version };

export const CONFIG = {
  intent: Intent.CONFIG,

  prompt: Prompt.CONFIG,

  version: Version.CONFIG,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
