export const RequestType = {
  TEXT: 'text',
  ACTION: 'action',
  INTENT: 'intent',
  LAUNCH: 'launch',
  NO_REPLY: 'no-reply',
} as const;

export type RequestType = (typeof RequestType)[keyof typeof RequestType];
