import type * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Voice from './voice';

export { InvocationName, Locale, Voice };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Utils.Config>()({
  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,
});

export type Config = typeof CONFIG;
