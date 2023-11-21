import type { Enum } from '@/utils/type/enum';

export const NodeType = {
  TEXT: 'text',
  BLOCK: 'block',
  START: 'start',
  ACTIONS: 'actions',
  FUNCTION: 'function',
} as const;

export type NodeType = Enum<typeof NodeType>;
