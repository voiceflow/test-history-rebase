import type * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as Voice from './voice';

export { Voice };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Utils.Config>()({
  voice: Voice.CONFIG,
});

export type Config = typeof CONFIG;
