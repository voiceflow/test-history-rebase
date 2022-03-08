import { Nullish } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const LEGACY_PLATFORM_TO_PROJECT_TYPE: {
  [key in VoiceflowConstants.PlatformType]?: { type: VoiceflowConstants.ProjectType; platform: VoiceflowConstants.PlatformType };
} = {
  [VoiceflowConstants.PlatformType.CHATBOT]: {
    type: VoiceflowConstants.ProjectType.CHAT,
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.GENERAL]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.IVR]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.MOBILE_APP]: {
    type: VoiceflowConstants.ProjectType.CHAT,
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: {
    type: VoiceflowConstants.ProjectType.CHAT,
    platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
  },
  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
  },
  [VoiceflowConstants.PlatformType.ALEXA]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    platform: VoiceflowConstants.PlatformType.ALEXA,
  },
  [VoiceflowConstants.PlatformType.GOOGLE]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    platform: VoiceflowConstants.PlatformType.GOOGLE,
  },
};

export const legacyPlatformToProjectType = (
  platform: VoiceflowConstants.PlatformType,
  type?: Nullish<VoiceflowConstants.ProjectType>
): { type: VoiceflowConstants.ProjectType; platform: VoiceflowConstants.PlatformType } => {
  if (!type) {
    const legacy = LEGACY_PLATFORM_TO_PROJECT_TYPE[platform];

    if (!legacy) throw new Error(`unknown platform type: ${platform}`);

    return legacy;
  }
  return { platform, type };
};

const PROJECT_TYPE_TO_LEGACY_PLATFORM: {
  [key in `${VoiceflowConstants.PlatformType}:${VoiceflowConstants.ProjectType}`]?: VoiceflowConstants.PlatformType;
} = {
  [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.VOICE}`]: VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE,
  [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.CHAT}`]: VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT,
  [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.VOICE}`]: VoiceflowConstants.PlatformType.GENERAL,
  [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: VoiceflowConstants.PlatformType.CHATBOT,
};

export const projectTypeToLegacyPlatform = (
  platform: VoiceflowConstants.PlatformType,
  type: VoiceflowConstants.ProjectType
): VoiceflowConstants.PlatformType => {
  return PROJECT_TYPE_TO_LEGACY_PLATFORM[`${platform}:${type}`] ?? platform;
};
