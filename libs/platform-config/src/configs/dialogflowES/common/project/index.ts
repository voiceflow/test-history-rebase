import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';

export { InvocationName, Locale };

export const CONFIG = ConfigUtils.partialSatisfies<Base.Project.Config>()({
  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,

  globalVariables: [
    ...Utils.array.withoutValues(Base.Project.CONFIG.globalVariables, [SystemVariable.LAST_RESPONSE, SystemVariable.LAST_UTTERANCE]),
    SystemVariable.CHANNEL,
  ],
});

export type Config = typeof CONFIG;
