import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

export const PLATFORM_VERSION_HEADER_TEXT = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Versions are created every time your project is uploaded to Alexa.',
    [Constants.PlatformType.GOOGLE]: 'Versions are created every time your project is uploaded to Google.',
  },
  ''
);
