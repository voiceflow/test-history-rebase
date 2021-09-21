import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

export const getPlatformLabel = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Alexa',
    [Constants.PlatformType.GOOGLE]: 'Google Actions',
  },
  'General Assistant'
);
