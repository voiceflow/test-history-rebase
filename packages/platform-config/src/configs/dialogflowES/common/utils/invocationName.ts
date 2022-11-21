import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

export const validate = ({ value }: Base.Utils.InvocationName.ValidateOptions): string | null =>
  !value?.trim() ? 'Your agent requires a valid name to be uploaded' : null;

export const CONFIG = Base.Utils.InvocationName.extend({
  validate,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
