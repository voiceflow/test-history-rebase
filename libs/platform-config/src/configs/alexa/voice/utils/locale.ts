import { AlexaConstants } from '@voiceflow/alexa-types';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Utils.Locale.extend({
  toVoiceflowLocale: (locale: AlexaConstants.Locale): VoiceflowConstants.Locale =>
    AlexaConstants.AmazonToVoiceflowLocaleMap[locale],
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
