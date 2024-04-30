import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';

export { InvocationName, Locale };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Project.Config>()({
  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,

  globalVariables: [
    ...Utils.array.withoutValues(Base.Project.CONFIG.globalVariables, [
      SystemVariable.LAST_RESPONSE,
      SystemVariable.LAST_UTTERANCE,
    ]),
    SystemVariable.CHANNEL,
  ],
});

export type Config = typeof CONFIG;
