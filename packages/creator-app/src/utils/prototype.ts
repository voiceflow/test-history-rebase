import { PlatformType } from '@voiceflow/internal';

import { isChatbotPlatform } from '@/utils/typeGuards';

export const canUseSoundToggle = (platform: PlatformType) => {
  const isChatbot = !!isChatbotPlatform(platform);

  return !isChatbot;
};
