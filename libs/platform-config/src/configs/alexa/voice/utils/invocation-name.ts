import { AlexaUtils } from '@voiceflow/alexa-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const validateName = ({ value, locales }: Base.Utils.InvocationName.ValidateOptions): string | null =>
  AlexaUtils.invocationName.getInvocationNameError(value ?? undefined, locales);

export const CONFIG = Base.Utils.InvocationName.extend({
  validate: validateName,
})(Base.Utils.InvocationName.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
