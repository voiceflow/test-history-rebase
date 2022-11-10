import * as Platform from '@voiceflow/platform-config';

import { createPlatformSelector } from '@/utils/platform';

export const PLATFORM_VERSION_HEADER_TEXT = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'New versions are created when you upload to Alexa.',
    [Platform.Constants.PlatformType.GOOGLE]: 'New versions are created when you upload to Google.',
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 'New versions are created when you upload to Dialogflow.',
  },
  'New versions are created when you upload your assistant.'
);
