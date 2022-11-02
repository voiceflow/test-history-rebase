import { Config as ConfigUtils } from '@platform/configs/utils';
import { Types } from '@platform/utils';

export interface Config {
  /**
   * @example 'Invocation Name' | 'Launch Command'
   */
  name: string;
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Invocation Name',
});

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
