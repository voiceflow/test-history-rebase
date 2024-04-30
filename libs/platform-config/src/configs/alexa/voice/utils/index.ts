import * as Common from '@/configs/common';
import { Config as ConfigUtils } from '@/configs/utils';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Voice from './voice';

export { InvocationName, Voice };

export const CONFIG = Common.Voice.Utils.extend({
  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,
})(Common.Voice.Utils.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
