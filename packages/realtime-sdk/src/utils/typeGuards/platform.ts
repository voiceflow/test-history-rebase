import {
  CHAT_PLATFORMS,
  DIALOGFLOW_PLATFORMS,
  DISTINCT_PLATFORMS,
  GENERAL_PLATFORMS,
  PLATFORMS_WITH_INVOCATION_NAME,
  VOICE_PLATFORMS,
} from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createTypeGuardCreator } from './utils';

const createPlatformTypeGuard = createTypeGuardCreator<VoiceflowConstants.PlatformType>();

export const isAlexaPlatform = createPlatformTypeGuard(VoiceflowConstants.PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard(VoiceflowConstants.PlatformType.GOOGLE);
export const isDialogflowPlatformV2 = createPlatformTypeGuard(VoiceflowConstants.PlatformType.DIALOGFLOW_ES);

export const isChatPlatform = createPlatformTypeGuard(CHAT_PLATFORMS);
export const isVoicePlatform = createPlatformTypeGuard(VOICE_PLATFORMS);
export const isDistinctPlatform = createPlatformTypeGuard(DISTINCT_PLATFORMS);
export const isDialogflowPlatform = createPlatformTypeGuard(DIALOGFLOW_PLATFORMS);
export const isAnyGeneralPlatform = createPlatformTypeGuard(GENERAL_PLATFORMS);
export const isPlatformWithInvocationName = createPlatformTypeGuard(PLATFORMS_WITH_INVOCATION_NAME);
