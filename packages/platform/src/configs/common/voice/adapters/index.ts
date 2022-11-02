import * as Base from '@platform/configs/base';
import { Config as ConfigUtils } from '@platform/configs/utils';

import * as Intent from './intent';

export { Intent };

export * as Prompt from './prompt';

export const CONFIG = Base.Adapters.extend({
  intent: { smart: Intent.smart, simple: Intent.simple },
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
