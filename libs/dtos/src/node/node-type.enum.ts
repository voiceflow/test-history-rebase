import type { Enum } from '@/utils/type/enum.util';

export const NodeType = {
  TEXT: 'text',
  NEXT: '_next',
  BLOCK: 'block',
  START: 'start',
  ACTIONS: 'actions',
  TRIGGER: 'trigger',
  FUNCTION: 'function',
  RESPONSE: 'response',
} as const;

export type NodeType = Enum<typeof NodeType>;
