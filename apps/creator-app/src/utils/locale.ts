import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const voiceflowLocaleToVoiceflowLang = (locale: VoiceflowConstants.Locale): VoiceflowConstants.Language =>
  (locale.split('-')[0] as VoiceflowConstants.Language) ?? VoiceflowConstants.Language.EN;
