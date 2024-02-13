export const StoryTriggerTarget = {
  EVENT: 'event',
  INTENT: 'intent',
} as const;

export type StoryTriggerTarget = (typeof StoryTriggerTarget)[keyof typeof StoryTriggerTarget];
