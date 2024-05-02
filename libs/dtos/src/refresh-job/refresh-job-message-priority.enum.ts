import type { Enum } from '@/utils/type/enum.util';

export const AmqpQueueMessagePriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
} as const;

export type AmqpQueueMessagePriority = Enum<typeof AmqpQueueMessagePriority>;
