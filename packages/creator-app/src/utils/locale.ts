import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants, DFESUtils } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleUtils } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { AnyLocale } from '@/platforms';

export const toVoiceflowLocale = (locale: AnyLocale, platform: VoiceflowConstants.PlatformType): VoiceflowConstants.Locale => {
  switch (platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return AlexaConstants.AmazonToVoiceflowLocaleMap[locale as AlexaConstants.Locale];

    case VoiceflowConstants.PlatformType.GOOGLE:
      return GoogleUtils.mappings.localesLangsToVoiceflowLocales([locale as GoogleConstants.Locale])[0];

    case VoiceflowConstants.PlatformType.DIALOGFLOW_ES:
      return DFESUtils.mappings.localesLangsToVoiceflowLocales([locale as DFESConstants.Locale])[0];

    default:
      return locale as VoiceflowConstants.Locale;
  }
};

export const voiceflowLocaleToVoiceflowLang = (locale: VoiceflowConstants.Locale): VoiceflowConstants.Language =>
  (locale.split('-')[0] as VoiceflowConstants.Language) ?? VoiceflowConstants.Language.EN;
