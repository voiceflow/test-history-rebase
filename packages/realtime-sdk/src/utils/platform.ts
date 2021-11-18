import { DISTINCT_PLATFORMS, DistinctPlatform } from '@realtime-sdk/constants';
import { AnyVoice } from '@realtime-sdk/models';
import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import { Constants, Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';

import { isDistinctPlatform } from './typeGuards';

export const createPlatformSelector: {
  <T>(platformValues: Record<Constants.PlatformType, T>, defaultValue?: T): (platform?: Nullish<Constants.PlatformType>) => T;
  <T>(platformValues: Partial<Record<Constants.PlatformType, T>>, defaultValue: T): (platform?: Nullish<Constants.PlatformType>) => T;
} =
  <T>(platformValues: Partial<Record<Constants.PlatformType, T>>, defaultValue: T | undefined) =>
  (platform?: Nullish<Constants.PlatformType>) => {
    const value = platform && platform in platformValues ? platformValues[platform] : defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const createAdvancedPlatformSelector =
  <T extends Partial<Record<Constants.PlatformType, any>>, D = undefined>(platformValues: T, defaultValue?: D) =>
  <P extends Constants.PlatformType>(platform: P): P extends keyof T ? T[P] : D =>
    createPlatformSelector(platformValues, defaultValue)(platform);

export const getPlatformValue: {
  <T>(platform: Constants.PlatformType, platformValues: Record<Constants.PlatformType, T>, defaultValue?: T): T;
  <T>(platform: Constants.PlatformType, platformValues: Partial<Record<Constants.PlatformType, T>>, defaultValue: T): T;
} = <T>(platform: Constants.PlatformType, platformValues: Partial<Record<Constants.PlatformType, T>>, defaultValue: T | undefined) =>
  createPlatformSelector(platformValues, defaultValue)(platform);

export const getDistinctPlatformValue = <T>(platform: Constants.PlatformType, platformValues: Record<DistinctPlatform, T>): T =>
  createPlatformSelector(platformValues, platformValues[Constants.PlatformType.GENERAL])(platform);

export const setDistinctPlatformValue = <T>(platform: Constants.PlatformType, value: T): Partial<Record<DistinctPlatform, T>> => ({
  [isDistinctPlatform(platform) ? platform : Constants.PlatformType.GENERAL]: value,
});

export const distinctPlatformsData = <T>(data: T): Record<DistinctPlatform, T> =>
  DISTINCT_PLATFORMS.reduce((acc, platform) => Object.assign(acc, { [platform]: data }), {} as Record<DistinctPlatform, T>);

export const getPlatformDefaultVoice = createPlatformSelector<AnyVoice>(
  {
    [Constants.PlatformType.ALEXA]: AlexaConstants.Voice.ALEXA,
    [Constants.PlatformType.GOOGLE]: GoogleConstants.Voice.DEFAULT,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: GoogleConstants.Voice.DEFAULT,
  },
  GeneralConstants.Voice.DEFAULT
);

export const getPlatformAppName = createPlatformSelector({
  [Constants.PlatformType.IVR]: 'IVR',
  [Constants.PlatformType.ALEXA]: 'Alexa Skill',
  [Constants.PlatformType.GOOGLE]: 'Google Action',
  [Constants.PlatformType.GENERAL]: 'Voice Assistant',
  [Constants.PlatformType.CHATBOT]: 'Chat Assistant',
  [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow Chat',
  [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow Voice',
  [Constants.PlatformType.MOBILE_APP]: 'Mobile App Project',
});

export const getPlatformProviderName = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Alexa',
    [Constants.PlatformType.GOOGLE]: 'Google',
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow',
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow',
  },
  'Custom'
);
