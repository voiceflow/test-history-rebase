import type { Enum } from '@/utils/type/enum.util';

export const TriggerNodeItemType = {
  INTENT: 'intent',
} as const;

export type TriggerNodeItemType = Enum<typeof TriggerNodeItemType>;
