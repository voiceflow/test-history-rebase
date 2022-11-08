import * as Common from '@platform-config/configs/common';

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

    settings: {
      smart: Version.Settings.smart,
      simple: Version.Settings.simple,
    },

    publishing: {
      smart: Version.Publishing.smart,
      simple: Version.Publishing.simple,
    },
  },
});

export type Config = typeof CONFIG;
