import { Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { Voice as GeneralVoice } from '@voiceflow/general-types';
import { Voice as GoogleVoice } from '@voiceflow/google-types';

import { DISTINCT_PLATFORMS, DistinctPlatform, PlatformType } from '@/constants';
import { AnyVoice } from '@/ducks/version/types';

export const createPlatformSelector: {
  <T extends any>(platformValues: Record<PlatformType, T>, defaultValue?: T): (platform: PlatformType) => T;
  <T extends any>(platformValues: Partial<Record<PlatformType, T>>, defaultValue: T): (platform: PlatformType) => T;
} = <T extends any>(platformValues: Partial<Record<PlatformType, T>>, defaultValue: T | undefined) => (platform: PlatformType) => {
  const value = platform in platformValues ? platformValues[platform] : defaultValue;
  if (value == null) throw new Error('no value for platform');

  return value;
};

export const getPlatformValue: {
  <T extends any>(platform: PlatformType, platformValues: Record<PlatformType, T>, defaultValue?: T): T;
  <T extends any>(platform: PlatformType, platformValues: Partial<Record<PlatformType, T>>, defaultValue: T): T;
} = <T extends any>(platform: PlatformType, platformValues: Partial<Record<PlatformType, T>>, defaultValue: T | undefined) =>
  createPlatformSelector(platformValues, defaultValue)(platform);

export const getDistinctPlatformValue = <T extends any>(platform: PlatformType, platformValues: Record<DistinctPlatform, T>): T =>
  createPlatformSelector(platformValues, platformValues[PlatformType.GENERAL])(platform);

export const setDistinctPlatformValue = <T extends any>(platform: PlatformType, value: T): Partial<Record<DistinctPlatform, T>> => ({
  [DISTINCT_PLATFORMS.includes(platform) ? platform : PlatformType.GENERAL]: value,
});

export const distinctPlatformsData = <T extends any>(data: T) =>
  DISTINCT_PLATFORMS.reduce((acc, platform) => Object.assign(acc, { [platform]: data }), {} as Record<DistinctPlatform, T>);

export const getPlatformDefaultVoice = createPlatformSelector<AnyVoice>(
  {
    [PlatformType.ALEXA]: AlexaVoice.ALEXA,
    [PlatformType.GOOGLE]: GoogleVoice.DEFAULT,
  },
  GeneralVoice.DEFAULT
);

export const getPlatformAppName = createPlatformSelector({
  [PlatformType.ALEXA]: 'Alexa Skill',
  [PlatformType.GOOGLE]: 'Google Action',
  [PlatformType.GENERAL]: 'General Project',
  [PlatformType.IVR]: 'IVR Project',
  [PlatformType.CHATBOT]: 'Chatbot Project',
  [PlatformType.MOBILE_APP]: 'Mobile App Project',
});
