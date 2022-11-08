import { Types } from '@platform-config/utils';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export { ProjectType } from '@voiceflow/voiceflow-types/build/esm/constants';

export enum BuiltInVariable {
  LOCALE = 'locale',
  CHANNEL = 'channel',
  USER_ID = 'user_id',
  SESSIONS = 'sessions',
  PLATFORM = 'platform',
  TIMESTAMP = 'timestamp',
  INTENT_CONFIDENCE = 'intent_confidence',
  LAST_UTTERANCE = 'last_utterance',
}

// enums doesn't support computed values for strings
export const PlatformType = Types.satisfies<Record<string, VoiceflowConstants.PlatformType>>()({
  ALEXA: VoiceflowConstants.PlatformType.ALEXA,
  GOOGLE: VoiceflowConstants.PlatformType.GOOGLE,
  WEBCHAT: VoiceflowConstants.PlatformType.WEBCHAT,
  VOICEFLOW: VoiceflowConstants.PlatformType.VOICEFLOW,
  DIALOGFLOW_ES: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
  DIALOGFLOW_CX: VoiceflowConstants.PlatformType.DIALOGFLOW_CX,
});

export type PlatformType = typeof PlatformType[keyof typeof PlatformType];
