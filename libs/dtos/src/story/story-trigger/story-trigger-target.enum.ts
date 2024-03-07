import type { Enum } from '@/utils/type/enum.util';

export const StoryTriggerTarget = {
  EVENT: 'event',
  INTENT: 'intent',
} as const;

export type StoryTriggerTarget = Enum<typeof StoryTriggerTarget>;
