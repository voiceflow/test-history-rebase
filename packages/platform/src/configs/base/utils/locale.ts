import { Config as ConfigUtils } from '@platform/configs/utils';
import { Types } from '@platform/utils';
import { Nullable } from '@voiceflow/common';

export interface Config {
  /**
   * transforms language to locale, useful for google and similar platforms
   * @example (language) => language
   */
  toLanguage: Nullable<(locale: string | string[]) => string>;

  /**
   * transforms locale to language, useful for google and similar platforms
   * @example (locale) => locale
   */
  fromLanguage: Nullable<(language: string) => string | string[]>;
}

export const CONFIG = Types.satisfies<Config>()({
  toLanguage: null,

  fromLanguage: null,
});

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
