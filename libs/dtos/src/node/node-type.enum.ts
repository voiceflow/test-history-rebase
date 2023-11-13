import type { Enum } from '@/utils/type/enum';

export const NodeType = {
  FUNCTION: 'function',
  TEXT: 'text',
} as const;

export type NodeType = Enum<typeof NodeType>;
