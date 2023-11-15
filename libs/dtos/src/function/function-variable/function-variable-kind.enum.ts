import type { Enum } from '@/utils/type/enum';

export const FunctionVariableKind = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export type FunctionVariableKind = Enum<typeof FunctionVariableKind>;
