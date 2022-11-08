import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const NLUType = Platform.Utils.Types.satisfies<Record<string, VoiceflowConstants.PlatformType>>()({
  LEX: VoiceflowConstants.PlatformType.LEX,
  LUIS: VoiceflowConstants.PlatformType.LUIS,
  RASA: VoiceflowConstants.PlatformType.RASA,
  WATSON: VoiceflowConstants.PlatformType.WATSON,
  EINSTEIN: VoiceflowConstants.PlatformType.EINSTEIN,
  NUANCE_MIX: VoiceflowConstants.PlatformType.NUANCE_MIX,

  // Some platforms have the same NLU type
  ALEXA: Platform.Constants.PlatformType.ALEXA,
  GOOGLE: Platform.Constants.PlatformType.GOOGLE,
  VOICEFLOW: Platform.Constants.PlatformType.VOICEFLOW,
  DIALOGFLOW_ES: Platform.Constants.PlatformType.DIALOGFLOW_ES,
  DIALOGFLOW_CX: Platform.Constants.PlatformType.DIALOGFLOW_CX,
});

export type NLUType = typeof NLUType[keyof typeof NLUType];
