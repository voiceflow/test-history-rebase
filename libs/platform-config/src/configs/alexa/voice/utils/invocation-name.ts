import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { AlexaUtils } from '@voiceflow/alexa-types';

export const validateName = ({ value, locales }: Base.Utils.InvocationName.ValidateOptions): string | null =>
  AlexaUtils.invocationName.getInvocationNameError(value ?? undefined, locales);

export const CONFIG = Base.Utils.InvocationName.extend({
  validate: validateName,
})(Base.Utils.InvocationName.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
