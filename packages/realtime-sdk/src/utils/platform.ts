import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';

import { DISTINCT_PLATFORMS, DistinctPlatform } from '../constants';
import { AnyVoice } from '../models';
import { isDistinctPlatform } from './typeGuards';

export const createPlatformSelector: {
  <T>(platformValues: Record<PlatformType, T>, defaultValue?: T): (platform: PlatformType) => T;
  <T>(platformValues: Partial<Record<PlatformType, T>>, defaultValue: T): (platform: PlatformType) => T;
} =
  <T>(platformValues: Partial<Record<PlatformType, T>>, defaultValue: T | undefined) =>
  (platform: PlatformType) => {
    const value = platform in platformValues ? platformValues[platform] : defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const getPlatformValue: {
  <T>(platform: PlatformType, platformValues: Record<PlatformType, T>, defaultValue?: T): T;
  <T>(platform: PlatformType, platformValues: Partial<Record<PlatformType, T>>, defaultValue: T): T;
} = <T>(platform: PlatformType, platformValues: Partial<Record<PlatformType, T>>, defaultValue: T | undefined) =>
  createPlatformSelector(platformValues, defaultValue)(platform);

export const getDistinctPlatformValue = <T>(platform: PlatformType, platformValues: Record<DistinctPlatform, T>): T =>
  createPlatformSelector(platformValues, platformValues[PlatformType.GENERAL])(platform);

export const setDistinctPlatformValue = <T>(platform: PlatformType, value: T): Partial<Record<DistinctPlatform, T>> => ({
  [isDistinctPlatform(platform) ? platform : PlatformType.GENERAL]: value,
});

export const distinctPlatformsData = <T>(data: T) =>
  DISTINCT_PLATFORMS.reduce((acc, platform) => Object.assign(acc, { [platform]: data }), {} as Record<DistinctPlatform, T>);

export const getPlatformDefaultVoice = createPlatformSelector<AnyVoice>(
  {
    [PlatformType.ALEXA]: AlexaConstants.Voice.ALEXA,
    [PlatformType.GOOGLE]: GoogleConstants.Voice.DEFAULT,
  },
  GeneralConstants.Voice.DEFAULT
);

export const getPlatformAppName = createPlatformSelector({
  [PlatformType.IVR]: 'IVR',
  [PlatformType.ALEXA]: 'Alexa Skill',
  [PlatformType.GOOGLE]: 'Google Action',
  [PlatformType.GENERAL]: 'Voice Assistant',
  [PlatformType.CHATBOT]: 'Chat Assistant',
  [PlatformType.DIALOGFLOW]: 'Dialogflow',

  [PlatformType.MOBILE_APP]: 'Mobile App Project',
});
