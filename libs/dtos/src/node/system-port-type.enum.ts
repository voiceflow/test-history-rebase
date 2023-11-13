import type { Enum } from '@/utils/type/enum';

export const SystemPortType = {
  FAIL: 'fail',
  NEXT: 'next',
  PAUSE: 'pause',
  NO_REPLY: 'no-reply',
  NO_MATCH: 'else',
  PREVIOUS: 'previous',
} as const;

export type SystemPortType = Enum<typeof SystemPortType>;
