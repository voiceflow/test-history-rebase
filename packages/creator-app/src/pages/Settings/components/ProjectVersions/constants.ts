import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

export const PLATFORM_VERSION_HEADER_TEXT = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Versions are created every time your project is uploaded to Alexa.',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Versions are created every time your project is uploaded to Google.',
  },
  ''
);
