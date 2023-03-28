import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

import * as Intent from './intent';
import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Prompt from './prompt';
import * as Voice from './voice';

export { Intent, InvocationName, Locale, Prompt, Voice };

export interface Config {
  voice: Voice.Config;

  prompt: Prompt.Config;

  locale: Locale.Config;

  intent: Intent.Config;

  invocationName: InvocationName.Config;
}

export const CONFIG = Types.satisfies<Config>()({
  voice: Voice.CONFIG,

  prompt: Prompt.CONFIG,

  locale: Locale.CONFIG,

  intent: Intent.CONFIG,

  invocationName: InvocationName.CONFIG,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
