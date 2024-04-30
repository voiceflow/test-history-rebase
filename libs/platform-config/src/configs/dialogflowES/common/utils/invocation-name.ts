import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const validateName = ({ value }: Base.Utils.InvocationName.ValidateOptions): string | null =>
  !value?.trim() ? 'Your agent requires a valid name to be uploaded' : null;

export const CONFIG = Base.Utils.InvocationName.extend({
  validate: validateName,
})(Base.Utils.InvocationName.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
