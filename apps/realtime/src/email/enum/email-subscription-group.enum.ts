export const EmailSubscriptionGroup = {
  COMMENTING: 14957,
  PROJECT_ACTIVITY: 14986,
} as const;

export type EmailSubscriptionGroup = (typeof EmailSubscriptionGroup)[keyof typeof EmailSubscriptionGroup];
