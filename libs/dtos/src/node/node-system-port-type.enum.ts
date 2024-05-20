import type { Enum } from '@/utils/type/enum.util';

export const NodeSystemPortType = {
  FAIL: 'fail',
  NEXT: 'next',
  PAUSE: 'pause',
  NO_REPLY: 'no-reply',
  NO_MATCH: 'else',
  PREVIOUS: 'previous',
} as const;

export type NodeSystemPortType = Enum<typeof NodeSystemPortType>;
