import * as Common from '@platform-config/configs/common';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as InvocationName from './invocationName';

export { InvocationName };

export const CONFIG = Common.Voice.Utils.extend({
  invocationName: InvocationName.CONFIG,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
