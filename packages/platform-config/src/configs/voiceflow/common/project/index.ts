import * as Base from '@platform-config/configs/base';
import { BuiltInVariable } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

export const CONFIG = Types.partialSatisfies<Base.Project.Config>()({
  invocationName: null,

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.LAST_UTTERANCE],
});

export type Config = typeof CONFIG;
