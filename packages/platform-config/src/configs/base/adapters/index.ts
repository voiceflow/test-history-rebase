import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as Intent from './intent';
import * as Version from './version';

export { Intent, Version };

export * as Utils from './utils';

export const CONFIG = {
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
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
