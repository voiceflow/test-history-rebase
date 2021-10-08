import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

export const getPlatformLabel = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Alexa',
    [Constants.PlatformType.GOOGLE]: 'Google Actions',
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow Chat',
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow Voice',
  },
  'General Assistant'
);
