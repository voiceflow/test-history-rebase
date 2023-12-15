import { z } from 'zod';

export const AIMessageRole = {
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
  USER: 'user',
} as const;

export type AIMessageRole = (typeof AIMessageRole)[keyof typeof AIMessageRole];

export const AIMessageDTO = z.object({
  role: z.nativeEnum(AIMessageRole),
  content: z.string(),
});

export type AIMessage = z.infer<typeof AIMessageDTO>;
