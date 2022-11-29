import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { DFESConstants } from '@voiceflow/google-dfes-types';

import * as GoogleLocale from '../project/locale';

export const CONFIG = Base.Utils.Locale.extend({
  toLanguage: (locales: DFESConstants.Locale[]): DFESConstants.Language =>
    GoogleLocale.CONFIG.list.find((language) => DFESConstants.LanguageToLocale[language]?.includes(locales[0])) ?? DFESConstants.Language.EN,

  fromLanguage: (language: DFESConstants.Language): DFESConstants.Locale[] => DFESConstants.LanguageToLocale[language],
})(Base.Utils.Locale.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
