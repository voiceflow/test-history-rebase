import { AlexaConstants } from '@voiceflow/alexa-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Utils.Voice.extend({
  getLocaleDefault: (locales: AlexaConstants.Locale[]): AlexaConstants.Voice =>
    AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locales[0]] || null,
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
