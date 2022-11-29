import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

export interface Config {
  /**
   * transforms language to locale, useful for google and similar platforms
   * @example (language) => language
   */
  toLanguage: (locales: string[]) => string;

  /**
   * transforms locale to language, useful for google and similar platforms
   * @example (locale) => locale
   */
  fromLanguage: (language: string) => string[];
}

export const CONFIG = Types.satisfies<Config>()({
  toLanguage: (locale) => locale[0],

  fromLanguage: (language) => [language],
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
