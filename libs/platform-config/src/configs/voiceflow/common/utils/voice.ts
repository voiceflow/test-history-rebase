import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { GoogleConstants } from '@voiceflow/google-types';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const CONFIG = Base.Utils.Voice.extend({
  getLocaleDefault: ([locale]: VoiceflowConstants.Locale[]): string | null => {
    if (Utils.object.hasProperty(AlexaConstants.DEFAULT_LOCALE_VOICE_MAP, locale)) {
      return (AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null) as string | null;
    }

    const language = Utils.object
      .getKeys(GoogleConstants.LanguageToLocale)
      .find((language) => GoogleConstants.LanguageToLocale[language].includes(locale as any));

    return (language && GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[language]) || null;
  },
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
