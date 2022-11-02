import { Config as ConfigUtils } from '@platform/configs/utils';
import { Types } from '@platform/utils';

import * as Intent from './intent';
import * as Version from './version';

export { Intent, Version };

export * as Utils from './utils';

export interface Config {
  intent: {
    smart: typeof Intent.smart;
    simple: typeof Intent.simple;
  };

  version: {
    simple: typeof Version.simple;

    session: {
      simple: typeof Version.Session.simple;
    };
  };
}

export const CONFIG = Types.satisfies<Config>()({
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

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
