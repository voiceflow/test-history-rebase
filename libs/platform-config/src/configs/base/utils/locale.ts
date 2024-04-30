import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

export interface Config {
  /**
   * transforms language to locale, useful for google and similar platforms
   */
  toLanguage: (locales: string[]) => string;

  /**
   * transforms locale to language, useful for google and similar platforms
   */
  fromLanguage: (language: string) => string[];

  /**
   * transforms platform locale to voiceflow locale
   */
  toVoiceflowLocale: (locale: string) => VoiceflowConstants.Locale;
}

export const CONFIG = Types.satisfies<Config>()({
  toLanguage: (locale) => locale[0],

  fromLanguage: (language) => [language],

  toVoiceflowLocale: (locale: string) => locale as VoiceflowConstants.Locale,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
