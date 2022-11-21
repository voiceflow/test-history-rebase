import * as Base from '@platform-config/configs/base';
import { Types } from '@platform-config/utils';

import * as InvocationName from './invocationName';

export { InvocationName };

export const CONFIG = Types.partialSatisfies<Base.Utils.Config>()({
  invocationName: InvocationName.CONFIG,
});

export type Config = typeof CONFIG;
