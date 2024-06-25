import type * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as Voice from './voice';

export { Voice };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Utils.Config>()({
  voice: Voice.CONFIG,
});

export type Config = typeof CONFIG;
