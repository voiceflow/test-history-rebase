import { PlatformType } from '@/constants';

export const CHANNEL_LABELS: Record<PlatformType, string> = {
  [PlatformType.ALEXA]: 'Alexa',
  [PlatformType.GOOGLE]: 'Google Actions',
  [PlatformType.GENERAL]: 'General Assistant',
};
