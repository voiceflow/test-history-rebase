import { Utils } from '@voiceflow/realtime-sdk';

export const {
  createPlatformSelector,
  getPlatformDefaultVoice,
  distinctPlatformsData,
  getPlatformValue,
  getDistinctPlatformValue,
  setDistinctPlatformValue,
  getPlatformAppName,
} = Utils.platform;
