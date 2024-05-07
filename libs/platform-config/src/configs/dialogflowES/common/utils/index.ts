import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as Locale from './locale';
import * as Voice from './voice';

export { Locale, Voice };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Utils.Config>()({
  voice: Voice.CONFIG,

  locale: Locale.CONFIG,
});

export type Config = typeof CONFIG;
