import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

import * as Intent from './intent';
import * as Locale from './locale';
import * as Prompt from './prompt';

export { Intent, Locale, Prompt };

export interface Config {
  prompt: Prompt.Config;

  locale: Locale.Config;

  intent: Intent.Config;
}

export const CONFIG = Types.satisfies<Config>()({
  prompt: Prompt.CONFIG,

  locale: Locale.CONFIG,

  intent: Intent.CONFIG,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
