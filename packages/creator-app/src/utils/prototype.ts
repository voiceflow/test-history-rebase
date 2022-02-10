import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const canUseSoundToggle = (platform: VoiceflowConstants.PlatformType) => {
  const isChatbot = !!Realtime.Utils.typeGuards.isChatPlatform(platform);

  return !isChatbot;
};

export const getPrototypeSessionID = (versionID: string | null, prototypeID: string | null): string => `${versionID}.${prototypeID}`;
