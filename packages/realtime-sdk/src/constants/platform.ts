import { Nullish, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export type PlatformProjectType = `${Platform.Constants.PlatformType}:${Platform.Constants.ProjectType}`;

const SUPPORTED_NLUS_MAP = Utils.array.createMap(Object.values(Platform.Constants.NLUType)) as Partial<Record<string, Platform.Constants.NLUType>>;
const SUPPORTED_TYPES_MAP = Utils.array.createMap(Object.values(Platform.Constants.ProjectType)) as Partial<
  Record<string, Platform.Constants.ProjectType>
>;

const LEGACY_PLATFORM_TO_PROJECT_TYPE: Partial<Record<string, { type: Platform.Constants.ProjectType; platform: Platform.Constants.PlatformType }>> =
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: {
      type: Platform.Constants.ProjectType.CHAT,
      platform: Platform.Constants.PlatformType.VOICEFLOW,
    },
    [VoiceflowConstants.PlatformType.GENERAL]: {
      type: Platform.Constants.ProjectType.VOICE,
      platform: Platform.Constants.PlatformType.VOICEFLOW,
    },
    [VoiceflowConstants.PlatformType.IVR]: {
      type: Platform.Constants.ProjectType.VOICE,
      platform: Platform.Constants.PlatformType.VOICEFLOW,
    },
    [VoiceflowConstants.PlatformType.MOBILE_APP]: {
      type: Platform.Constants.ProjectType.CHAT,
      platform: Platform.Constants.PlatformType.VOICEFLOW,
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      type: Platform.Constants.ProjectType.CHAT,
      platform: Platform.Constants.PlatformType.DIALOGFLOW_ES,
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      type: Platform.Constants.ProjectType.VOICE,
      platform: Platform.Constants.PlatformType.DIALOGFLOW_ES,
    },
    [VoiceflowConstants.PlatformType.ALEXA]: {
      type: Platform.Constants.ProjectType.VOICE,
      platform: Platform.Constants.PlatformType.ALEXA,
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      type: Platform.Constants.ProjectType.VOICE,
      platform: Platform.Constants.PlatformType.GOOGLE,
    },
  };

const PROJECT_TYPE_TO_LEGACY_PLATFORM: {
  [key in `${Platform.Constants.PlatformType}:${Platform.Constants.NLUType}:${Platform.Constants.ProjectType}`]?: VoiceflowConstants.PlatformType;
} = {
  [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.NLUType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.VOICE}`]:
    VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE,
  [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.NLUType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.CHAT}`]:
    VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT,
  [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.NLUType.VOICEFLOW}:${Platform.Constants.ProjectType.VOICE}`]:
    VoiceflowConstants.PlatformType.GENERAL,
  [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.NLUType.VOICEFLOW}:${Platform.Constants.ProjectType.CHAT}`]:
    VoiceflowConstants.PlatformType.CHATBOT,
};

interface Result {
  nlu: Platform.Constants.NLUType;
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
}

export const legacyPlatformToProjectType = (platform?: Nullish<string>, type?: Nullish<string>, nlu?: Nullish<string>): Result => {
  const legacy = platform ? LEGACY_PLATFORM_TO_PROJECT_TYPE[platform] : null;

  if (legacy) {
    // eslint-disable-next-line no-param-reassign
    ({ type, platform } = legacy);
  }

  const platformNLU = (platform ? SUPPORTED_NLUS_MAP[platform] : null) ?? Platform.Constants.NLUType.VOICEFLOW;

  return {
    nlu: (nlu ? SUPPORTED_NLUS_MAP[nlu] : null) ?? platformNLU,
    type: (type ? SUPPORTED_TYPES_MAP[type] : null) ?? Platform.Constants.ProjectType.VOICE,
    platform: Platform.Config.isSupported(platform) ? platform : Platform.Constants.PlatformType.VOICEFLOW,
  };
};

export const projectTypeToLegacyPlatform = ({ nlu, type, platform }: Result): VoiceflowConstants.PlatformType => {
  const legacyPlatform = PROJECT_TYPE_TO_LEGACY_PLATFORM[`${platform}:${nlu}:${type}`];

  if (legacyPlatform) return legacyPlatform;

  // platform is not equal to nlu, like webchat
  if (!SUPPORTED_NLUS_MAP[platform]) return platform;

  return nlu;
};
