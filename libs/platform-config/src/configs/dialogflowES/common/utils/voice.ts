import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Utils.Voice.extend({
  getLocaleDefault: ([locale]: DFESConstants.Locale[]): string | null => {
    const languageCode = DFESConstants.LocaleToVoiceLanguageCode[locale] ?? DFESConstants.VoiceLanguageCode.EN_US;
    const standardVoice = DFESConstants.VoiceLanguageCodeToVoice[languageCode].flatMap(({ voiceName }) =>
      voiceName.filter((name) => name.includes(GoogleConstants.VoiceType.STANDARD))
    );

    return standardVoice?.[0] ?? null;
  },
})(Base.Utils.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
