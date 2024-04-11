import type { Enum } from '@/utils/type/enum.util';

export const NodeType = {
  TEXT: 'text',
  BLOCK: 'block',
  START: 'start',
  ACTIONS: 'actions',
  TRIGGER: 'trigger',
  FUNCTION: 'function',
} as const;

export type NodeType = Enum<typeof NodeType>;
