import type * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as Locale from './locale';

export { Locale };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Project.Config>()({
  locale: Locale.CONFIG,

  invocationName: null,
});

export type Config = typeof CONFIG;
