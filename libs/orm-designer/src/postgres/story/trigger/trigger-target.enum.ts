export const TriggerTarget = {
  EVENT: 'event',
  INTENT: 'intent',
} as const;

export type TriggerTarget = (typeof TriggerTarget)[keyof typeof TriggerTarget];
