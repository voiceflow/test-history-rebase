import * as Base from '@platform-config/configs/base';
import { BuiltInVariable } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

import * as InvocationName from './invocationName';
import * as Locale from './locale';

export { InvocationName, Locale };

export const CONFIG = Types.partialSatisfies<Base.Project.Config>()({
  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.CHANNEL],
});

export type Config = typeof CONFIG;
