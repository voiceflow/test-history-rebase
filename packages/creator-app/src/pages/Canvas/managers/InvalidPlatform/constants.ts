import { PlatformType } from '@/constants';
import { createPlatformSelector } from '@/utils/platform';

export const getPlatformLabel = createPlatformSelector(
  {
    [PlatformType.ALEXA]: 'Alexa',
    [PlatformType.GOOGLE]: 'Google Actions',
  },
  'General Assistant'
);
