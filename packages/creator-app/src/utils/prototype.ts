import { Constants } from '@voiceflow/general-types';

import { isChatbotPlatform } from '@/utils/typeGuards';

export const canUseSoundToggle = (platform: Constants.PlatformType) => {
  const isChatbot = !!isChatbotPlatform(platform);

  return !isChatbot;
};
