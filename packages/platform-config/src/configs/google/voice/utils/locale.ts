import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as GoogleLocale from '../project/locale';

export const CONFIG = Base.Utils.Locale.extend({
  toLanguage: ([locale]: GoogleConstants.Locale[]): GoogleConstants.Language =>
    GoogleLocale.CONFIG.list.find((language) => GoogleConstants.LanguageToLocale[language]?.includes(locale)) ?? GoogleConstants.Language.EN,

  fromLanguage: (language: GoogleConstants.Language): GoogleConstants.Locale[] => GoogleConstants.LanguageToLocale[language],

  toVoiceflowLocale: (locale: GoogleConstants.Locale): VoiceflowConstants.Locale => GoogleConstants.GOOGLE_TO_VOICEFLOW_LOCALE_MAP[locale],
})(Base.Utils.Locale.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
