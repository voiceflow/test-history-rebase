import { legacyPlatformToProjectType, PLATFORMS_WITH_INVOCATION_NAME } from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createTypeGuardCreator } from './utils';

const { PlatformType, ProjectType } = VoiceflowConstants;

const createPlatformTypeGuard = createTypeGuardCreator<VoiceflowConstants.PlatformType>();
const createProjectTypeTypeGuard = createTypeGuardCreator<VoiceflowConstants.ProjectType>();

export const isAlexaOrGooglePlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>([
  VoiceflowConstants.PlatformType.ALEXA,
  VoiceflowConstants.PlatformType.GOOGLE,
]);

export const isAlexaPlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>(PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>(PlatformType.GOOGLE);
export const isDialogflowPlatform = (platform?: VoiceflowConstants.PlatformType | null): platform is VoiceflowConstants.PlatformType.DIALOGFLOW_ES =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === PlatformType.DIALOGFLOW_ES;
export const isVoiceflowPlatform = (platform?: VoiceflowConstants.PlatformType | null): platform is VoiceflowConstants.PlatformType.VOICEFLOW =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === PlatformType.VOICEFLOW;

type VoiceflowBasedPlatform = Exclude<
  VoiceflowConstants.PlatformType,
  VoiceflowConstants.PlatformType.ALEXA | VoiceflowConstants.PlatformType.GOOGLE | VoiceflowConstants.PlatformType.DIALOGFLOW_ES
>;

export const isVoiceflowBasedPlatform = (platform?: VoiceflowConstants.PlatformType | null): platform is VoiceflowBasedPlatform =>
  !!platform && !isAlexaPlatform(platform) && !isGooglePlatform(platform) && !isDialogflowPlatform(platform);

export const isOneClickChannelPlatform = createPlatformTypeGuard<VoiceflowConstants.PlatformType>([
  PlatformType.ALEXA,
  PlatformType.GOOGLE,
  PlatformType.DIALOGFLOW_ES,
]);

export const isChatProjectType = createProjectTypeTypeGuard(ProjectType.CHAT);
export const isVoiceProjectType = createProjectTypeTypeGuard(ProjectType.VOICE);

export const isPlatformWithInvocationName = createPlatformTypeGuard(PLATFORMS_WITH_INVOCATION_NAME);

export const isPlatformWithThirdPartyUpload = createPlatformTypeGuard([PlatformType.ALEXA, PlatformType.GOOGLE, PlatformType.DIALOGFLOW_ES]);
