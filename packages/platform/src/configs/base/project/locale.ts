import { Config as ConfigUtils } from '@platform/configs/utils';
import { Types } from '@platform/utils';

export interface Config {
  /**
   * list of language ids, used to render correct languages order
   */
  list: string[];

  /**
   * language enum
   */
  enum: Record<string, string>;

  /**
   * if the project supports multiple languages
   */
  multi: boolean;

  /**
   * if the toLanguage/fromLanguage utils should be used
   */
  language: boolean;

  /**
   * language label map
   */
  labelMap: Record<string, string>;

  /**
   * language label map
   */
  defaultLocale: string | string[];
}

const CONFIG = Types.satisfies<Config>()({
  list: ['en'],

  enum: { EN: 'en' },

  multi: false,

  language: false,

  labelMap: { en: 'English' },

  defaultLocale: 'en',
});

export const extend = ConfigUtils.extendFactory<Config>()(CONFIG);
