import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

export const PLATFORM_VERSION_HEADER_TEXT = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'New versions are created when you upload to Alexa.',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'New versions are created when you upload to Google.',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'New versions are created when you upload to Dialogflow.',
  },
  'New versions are created when you upload your assistant.'
);
