import type { Enum } from '@/utils/type/enum.util';

export const ReferenceResourceType = {
  NODE: 'node',
  INTENT: 'intent',
  PROMPT: 'prompt',
  MESSAGE: 'message',
  DIAGRAM: 'diagram',
  FUNCTION: 'function',
} as const;

export type ReferenceResourceType = Enum<typeof ReferenceResourceType>;
