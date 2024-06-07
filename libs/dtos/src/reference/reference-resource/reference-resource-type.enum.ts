import type { Enum } from '@/utils/type/enum.util';

export const ReferenceResourceType = {
  NODE: 'node',
  FLOW: 'flow',
  INTENT: 'intent',
  DIAGRAM: 'diagram',
  RESPONSE: 'response',
  WORKFLOW: 'workflow',
} as const;

export type ReferenceResourceType = Enum<typeof ReferenceResourceType>;
