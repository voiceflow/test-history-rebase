import { legacyPlatformToProjectType, PLATFORMS_WITH_INVOCATION_NAME } from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createTypeGuardCreator } from './utils';

const createPlatformTypeGuard = createTypeGuardCreator<VoiceflowConstants.PlatformType>();
const createProjectTypeTypeGuard = createTypeGuardCreator<VoiceflowConstants.ProjectType>();

export const isAlexaOrGooglePlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>([
  VoiceflowConstants.PlatformType.ALEXA,
  VoiceflowConstants.PlatformType.GOOGLE,
]);

export const isAlexaPlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>(VoiceflowConstants.PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>(VoiceflowConstants.PlatformType.GOOGLE);
export const isDialogflowPlatform = (platform?: VoiceflowConstants.PlatformType | null): platform is VoiceflowConstants.PlatformType.DIALOGFLOW_ES =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === VoiceflowConstants.PlatformType.DIALOGFLOW_ES;
export const isVoiceflowPlatform = (platform?: VoiceflowConstants.PlatformType | null): platform is VoiceflowConstants.PlatformType.VOICEFLOW =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === VoiceflowConstants.PlatformType.VOICEFLOW;

export const isChatProjectType = createProjectTypeTypeGuard(VoiceflowConstants.ProjectType.CHAT);
export const isVoiceProjectType = createProjectTypeTypeGuard(VoiceflowConstants.ProjectType.VOICE);

export const isPlatformWithInvocationName = createPlatformTypeGuard(PLATFORMS_WITH_INVOCATION_NAME);
