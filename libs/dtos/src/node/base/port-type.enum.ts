import type { Enum } from '@/utils/type/enum';

export const PortType = {
  FAIL: 'fail',
  NEXT: 'next',
  PAUSE: 'pause',
  NO_REPLY: 'no-reply',
  NO_MATCH: 'else',
  PREVIOUS: 'previous',
} as const;

export type PortType = Enum<typeof PortType>;
