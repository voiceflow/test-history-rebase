import type { Enum } from '@/utils/type/enum.util';

export const ReferenceResourceType = {
  NODE: 'node',
  INTENT: 'intent',
  DIAGRAM: 'diagram',
  FUNCTION: 'function',
  RESPONSE: 'response',
} as const;

export type ReferenceResourceType = Enum<typeof ReferenceResourceType>;
