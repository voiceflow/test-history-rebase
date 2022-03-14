import { AnyVoice } from '@realtime-sdk/models';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { legacyPlatformToProjectType, NonDeprecatedPlatform } from '../constants/platform';

export const createProjectTypeSelectorV2 =
  <T>(values: Record<VoiceflowConstants.ProjectType, T>) =>
  (type?: VoiceflowConstants.ProjectType | null): T => {
    const value = values[type || VoiceflowConstants.ProjectType.VOICE];
    if (value == null) throw new Error('no value for project type');

    return value;
  };

export const createPlatformAndProjectTypeSelectorV2 =
  <T>(
    values: Partial<Record<VoiceflowConstants.ProjectType | NonDeprecatedPlatform | `${NonDeprecatedPlatform}:${VoiceflowConstants.ProjectType}`, T>>,
    defaultValue?: T
  ) =>
  (_platform: Nullish<VoiceflowConstants.PlatformType>, _type: Nullish<VoiceflowConstants.ProjectType>): T => {
    const mapping = _platform ? legacyPlatformToProjectType(_platform, _type) : null;

    // order of priority for checking in the selector:
    // 1. compound platform + type
    // 2. platform
    // 3. type
    const value = (mapping && (values[`${mapping.platform}:${mapping.type}`] ?? values[mapping.platform] ?? values[mapping.type])) ?? defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const createPlatformSelectorV2 =
  <T>(platformValues: Partial<Record<NonDeprecatedPlatform, T>>, defaultValue?: T) =>
  (_platform?: Nullish<VoiceflowConstants.PlatformType>): T => {
    const platform = _platform ? legacyPlatformToProjectType(_platform).platform : _platform;

    const value = platform && platform in platformValues ? platformValues[platform] : defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const createPlatformSelector: {
  <T>(platformValues: Record<VoiceflowConstants.PlatformType, T>, defaultValue?: T): (platform?: Nullish<VoiceflowConstants.PlatformType>) => T;
  <T>(platformValues: Partial<Record<VoiceflowConstants.PlatformType, T>>, defaultValue: T): (
    platform?: Nullish<VoiceflowConstants.PlatformType>
  ) => T;
} =
  <T>(platformValues: Partial<Record<VoiceflowConstants.PlatformType, T>>, defaultValue: T | undefined) =>
  (platform?: Nullish<VoiceflowConstants.PlatformType>) => {
    const value = platform && platform in platformValues ? platformValues[platform] : defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const createAdvancedPlatformSelector =
  <T extends Partial<Record<VoiceflowConstants.PlatformType, any>>, D = undefined>(platformValues: T, defaultValue?: D) =>
  <P extends VoiceflowConstants.PlatformType>(platform: P): P extends keyof T ? T[P] : D =>
    createPlatformSelector(platformValues, defaultValue)(platform);

export const getPlatformValue: {
  <T>(platform: VoiceflowConstants.PlatformType, platformValues: Record<VoiceflowConstants.PlatformType, T>, defaultValue?: T): T;
  <T>(platform: VoiceflowConstants.PlatformType, platformValues: Partial<Record<VoiceflowConstants.PlatformType, T>>, defaultValue: T): T;
} = <T>(
  platform: VoiceflowConstants.PlatformType,
  platformValues: Partial<Record<VoiceflowConstants.PlatformType, T>>,
  defaultValue: T | undefined
) => createPlatformSelector(platformValues, defaultValue)(platform);

export const getPlatformDefaultVoice = createPlatformSelectorV2<AnyVoice>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaConstants.Voice.ALEXA,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleConstants.Voice.DEFAULT,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: GoogleConstants.Voice.DEFAULT,
  },
  VoiceflowConstants.Voice.DEFAULT
);

export const getPlatformAppName = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.IVR]: 'IVR',
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Action',
    [VoiceflowConstants.PlatformType.GENERAL]: 'Voice Assistant',
    [VoiceflowConstants.PlatformType.CHATBOT]: 'Chat Assistant',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow Chat',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow Voice',
    [VoiceflowConstants.PlatformType.MOBILE_APP]: 'Mobile App Project',
  },
  'Assistant'
);

export const getPlatformProviderName = createPlatformSelectorV2(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow',
  },
  'Custom'
);
