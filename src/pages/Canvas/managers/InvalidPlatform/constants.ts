import { PlatformType } from '@/constants';

export const CHANNEL_LABELS: Record<PlatformType, string> = {
  [PlatformType.ALEXA]: 'Alexa',
  [PlatformType.GOOGLE]: 'Google Actions',
  [PlatformType.GENERAL]: 'General Assistant',
  [PlatformType.IVR]: 'General Assistant',
  [PlatformType.CHATBOT]: 'General Assistant',
  [PlatformType.MOBILE_APP]: 'General Assistant',
};
