import { AnyVoice, PrototypeLayout } from '@realtime-sdk/models';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { legacyPlatformToProjectType, NonDeprecatedPlatform, PlatformProjectType } from '../constants/platform';

export const createProjectTypeSelector =
  <T>(values: Record<VoiceflowConstants.ProjectType, T>) =>
  (type?: VoiceflowConstants.ProjectType | null): T => {
    const value = values[type || VoiceflowConstants.ProjectType.VOICE];
    if (value == null) throw new Error('no value for project type');

    return value;
  };

export const createAdvancedProjectTypeSelector =
  <T extends Record<VoiceflowConstants.ProjectType, any>>(values: T) =>
  <P extends VoiceflowConstants.ProjectType>(platform: P): T[P] =>
    createProjectTypeSelector(values)(platform);

export const createPlatformAndProjectTypeSelector =
  <T>(values: Partial<Record<VoiceflowConstants.ProjectType | NonDeprecatedPlatform | PlatformProjectType, T>>, defaultValue?: T) =>
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

export const createPlatformSelector =
  <T>(platformValues: Partial<Record<NonDeprecatedPlatform, T>>, defaultValue?: T) =>
  (_platform?: Nullish<VoiceflowConstants.PlatformType>): T => {
    const platform = _platform ? legacyPlatformToProjectType(_platform).platform : _platform;
    const value = platform && platform in platformValues ? platformValues[platform] : defaultValue;
    if (value == null) throw new Error(`no value for platform ${platform}`);

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

export const getPlatformDefaultVoice = createPlatformSelector<AnyVoice>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaConstants.Voice.ALEXA,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleConstants.Voice.DEFAULT,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: GoogleConstants.Voice.DEFAULT,
  },
  VoiceflowConstants.Voice.DEFAULT
);

export const getProjectTypeTitle: Record<VoiceflowConstants.ProjectType, string> = {
  [VoiceflowConstants.ProjectType.CHAT]: 'Chat',
  [VoiceflowConstants.ProjectType.VOICE]: 'Voice',
};

export const getPlatformAppName = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Action',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow ES',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: 'Dialogflow CX',
    [VoiceflowConstants.PlatformType.LUIS]: 'Microsoft Luis',
    [VoiceflowConstants.PlatformType.LEX]: 'Amazon Lex',
    [VoiceflowConstants.PlatformType.RASA]: 'Rasa',
    [VoiceflowConstants.PlatformType.WATSON]: 'IBM Watson',
    [VoiceflowConstants.PlatformType.EINSTEIN]: 'Salesforce Einstein',
    [VoiceflowConstants.PlatformType.NUANCE_MIX]: 'Nuance Mix',
    [VoiceflowConstants.PlatformType.WEBCHAT]: 'Web Chat',
  },
  ''
);

export const getPlatformProviderName = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow ES',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: 'Dialogflow CX',
  },
  'Custom'
);

export const getDefaultPrototypeLayout = createProjectTypeSelector({
  [VoiceflowConstants.ProjectType.CHAT]: PrototypeLayout.TEXT_DIALOG,
  [VoiceflowConstants.ProjectType.VOICE]: PrototypeLayout.VOICE_DIALOG,
});
