import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

export interface Config {
  default: string;
}

export const CONFIG = Types.satisfies<Config>()({
  default: 'default',
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
