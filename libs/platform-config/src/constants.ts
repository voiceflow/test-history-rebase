import * as Types from '@platform-config/utils/types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export { ProjectType } from '@voiceflow/voiceflow-types/build/cjs/constants';

// enums doesn't support computed values for strings
export const PlatformType = Types.satisfies<Record<string, VoiceflowConstants.PlatformType>>()({
  ALEXA: VoiceflowConstants.PlatformType.ALEXA,
  GOOGLE: VoiceflowConstants.PlatformType.GOOGLE,
  WEBCHAT: VoiceflowConstants.PlatformType.WEBCHAT,
  WHATSAPP: VoiceflowConstants.PlatformType.WHATSAPP,
  SMS: VoiceflowConstants.PlatformType.SMS,
  VOICEFLOW: VoiceflowConstants.PlatformType.VOICEFLOW,
  DIALOGFLOW_ES: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
  DIALOGFLOW_CX: VoiceflowConstants.PlatformType.DIALOGFLOW_CX,
  MICROSOFT_TEAMS: VoiceflowConstants.PlatformType.MICROSOFT_TEAMS,
} as const);

export type PlatformType = typeof PlatformType[keyof typeof PlatformType];

export const NLUType = Types.satisfies<Record<string, VoiceflowConstants.PlatformType>>()({
  LEX: VoiceflowConstants.PlatformType.LEX,
  LUIS: VoiceflowConstants.PlatformType.LUIS,
  RASA: VoiceflowConstants.PlatformType.RASA,
  WATSON: VoiceflowConstants.PlatformType.WATSON,
  EINSTEIN: VoiceflowConstants.PlatformType.EINSTEIN,
  NUANCE_MIX: VoiceflowConstants.PlatformType.NUANCE_MIX,

  // some platforms have the same NLU type
  ALEXA: PlatformType.ALEXA,
  GOOGLE: PlatformType.GOOGLE,
  VOICEFLOW: PlatformType.VOICEFLOW,
  DIALOGFLOW_ES: PlatformType.DIALOGFLOW_ES,
  DIALOGFLOW_CX: PlatformType.DIALOGFLOW_CX,
} as const);

export type NLUType = typeof NLUType[keyof typeof NLUType];
