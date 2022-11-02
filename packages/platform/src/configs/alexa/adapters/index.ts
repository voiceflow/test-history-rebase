import * as Common from '@platform/configs/common';

import * as Intent from './intent';
import * as Version from './version';

export { Intent, Version };

export * as Prompt from './prompt';

export const CONFIG = Common.Voice.Adapters.extend({
  intent: {
    smart: Intent.smart,
    simple: Intent.simple,
  },

  version: {
    simple: Version.simple,

    session: {
      simple: Version.Session.simple,
    },
  },
});

export type Config = typeof CONFIG;
