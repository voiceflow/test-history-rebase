import * as Base from '@platform-config/configs/base';
import { BuiltInVariable } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

export const CONFIG = Types.partialSatisfies<Base.Project.Config>()({
  invocationName: { name: 'Agent Name' },

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.CHANNEL],
});

export type Config = typeof CONFIG;
