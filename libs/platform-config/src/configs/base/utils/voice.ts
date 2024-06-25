import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

export interface Config {
  getLocaleDefault: (locales: string[]) => string | null;
}

export const CONFIG = Types.satisfies<Config>()({
  getLocaleDefault: (_locales: string[]) => null,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
