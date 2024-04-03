import type { Enum } from '@/utils/type/enum.util';

export const FunctionVariableType = {
  ANY: 'any',
  ARRAY: 'array',
  STRING: 'string',
  OBJECT: 'object',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
} as const;

export type FunctionVariableType = Enum<typeof FunctionVariableType>;
