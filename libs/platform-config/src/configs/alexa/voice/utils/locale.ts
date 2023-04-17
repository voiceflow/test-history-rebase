import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const CONFIG = Base.Utils.Locale.extend({
  toVoiceflowLocale: (locale: AlexaConstants.Locale): VoiceflowConstants.Locale => AlexaConstants.AmazonToVoiceflowLocaleMap[locale],
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
