import type { Enum } from '@/utils/type/enum.util';

export const CaptureV3NodeCaptureType = {
  ENTITY: 'entity',
  USER_REPLY: 'user-reply',
} as const;

export type CaptureV3NodeCaptureType = Enum<typeof CaptureV3NodeCaptureType>;
