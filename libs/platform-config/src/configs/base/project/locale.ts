import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import React from 'react';

export interface Config {
  /**
   * @example 'Language' | 'Locales'
   */
  name: string;

  /**
   * list of locale ids, used to locales in correct order
   */
  list: string[];

  /**
   * locale enum
   */
  enum: Record<string, string>;

  /**
   * indicates if the project supports multiple locales
   */
  multi: boolean;

  /**
   * indicates if the project supports updating the locale after creation
   */
  editable: boolean;

  /**
   * indicates where locales are stored in the version's platform data
   */
  storedIn: 'settings' | 'publishing';

  /**
   * locale label map
   */
  labelMap: Record<string, string>;

  /**
   * used in settings
   */
  description: React.ReactNode;

  /**
   * indicates that it's a language config, language is a group of locales
   * the toLanguage/fromLanguage utils will be used
   */
  isLanguage: boolean;

  /**
   * list of default locales
   */
  defaultLocales: string[];

  /**
   * preferred locales are rendered first in the list and separated by a divider
   */
  preferredLocales: string[];

  /**
   * list of locale ids that support utterances recommendations
   */
  utteranceRecommendations: string[];
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Language',

  list: ['en'],

  enum: { EN: 'en' },

  multi: false,

  editable: false,

  storedIn: 'settings',

  labelMap: { en: 'English' },

  isLanguage: false,

  description: 'The language(s) that your agent supports.',

  defaultLocales: ['en'],

  preferredLocales: [],

  utteranceRecommendations: ['en'],
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
