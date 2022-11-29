import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BuiltInVariable } from '@platform-config/constants';

import * as Locale from './locale';

export { Locale };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Project.Config>()({
  locale: Locale.CONFIG,

  invocationName: null,

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.LAST_UTTERANCE],
});

export type Config = typeof CONFIG;
