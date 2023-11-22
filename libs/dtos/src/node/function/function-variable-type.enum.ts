import type { Enum } from '@/utils/type/enum.util';

export const FunctionVariableType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  OBJECT: 'object',
} as const;

export type FunctionVariableType = Enum<typeof FunctionVariableType>;
