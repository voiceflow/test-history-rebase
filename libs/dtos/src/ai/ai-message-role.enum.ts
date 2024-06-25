// internal voiceflow message roles, roughly maps to OpenAI
export const AIMessageRole = {
  USER: 'user',
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
} as const;

export type AIMessageRole = (typeof AIMessageRole)[keyof typeof AIMessageRole];
