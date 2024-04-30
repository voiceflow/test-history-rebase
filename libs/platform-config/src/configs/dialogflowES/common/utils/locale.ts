import { DFESConstants } from '@voiceflow/google-dfes-types';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as GoogleLocale from '../project/locale';

export const CONFIG = Base.Utils.Locale.extend({
  toLanguage: (locales: DFESConstants.Locale[]): DFESConstants.Language =>
    GoogleLocale.CONFIG.list.find((language) => DFESConstants.LanguageToLocale[language]?.includes(locales[0])) ??
    DFESConstants.Language.EN,

  fromLanguage: (language: DFESConstants.Language): DFESConstants.Locale[] => DFESConstants.LanguageToLocale[language],

  toVoiceflowLocale: (locale: DFESConstants.Locale): VoiceflowConstants.Locale =>
    DFESConstants.DIALOGFLOW_TO_VOICEFLOW_LOCALE_MAP[locale],
})(Base.Utils.Locale.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
