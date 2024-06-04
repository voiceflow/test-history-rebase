export const ResponseType = {
  PROMPT: 'prompt',
  TEXT: 'text',
} as const;

export type ResponseType = (typeof ResponseType)[keyof typeof ResponseType];
