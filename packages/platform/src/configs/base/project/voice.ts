import { Config as ConfigUtils } from '@platform/configs/utils';
import { Types } from '@platform/utils';

export interface Config {
  default: string;
}

export const CONFIG = Types.satisfies<Config>()({
  default: 'default',
});

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
