import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

import * as Locale from './locale';

export * as Locale from './locale';

export interface Config {
  locale: Locale.Config;
}

export const CONFIG = Types.satisfies<Config>()({
  locale: Locale.CONFIG,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
