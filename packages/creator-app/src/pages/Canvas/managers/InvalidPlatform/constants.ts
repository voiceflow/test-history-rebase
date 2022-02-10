import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

export const getPlatformLabel = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Actions',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow Chat',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow Voice',
  },
  'General Assistant'
);
