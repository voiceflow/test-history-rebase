import { Utils } from '@voiceflow/common';
import { GoogleConstants } from '@voiceflow/google-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Utils.Voice.extend({
  getLocaleDefault: ([locale]: GoogleConstants.Locale[]): string | null => {
    const language = Utils.object
      .getKeys(GoogleConstants.LanguageToLocale)
      .find((language) => GoogleConstants.LanguageToLocale[language].includes(locale));

    return (language && GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[language]) || null;
  },
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
