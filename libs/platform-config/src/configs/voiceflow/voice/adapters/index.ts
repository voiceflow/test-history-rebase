import * as Common from '@/configs/common';

import * as Intent from './intent';
import * as Prompt from './prompt';
import * as Version from './version';

export { Intent, Prompt, Version };

export const CONFIG = Common.Voice.Adapters.extend({
  intent: Intent.CONFIG,

  prompt: Prompt.CONFIG,

  version: Version.CONFIG,
})(Common.Voice.Adapters.validate);

export type Config = typeof CONFIG;
