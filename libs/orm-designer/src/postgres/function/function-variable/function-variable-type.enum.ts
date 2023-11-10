export const FunctionVariableType = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export type FunctionVariableType = (typeof FunctionVariableType)[keyof typeof FunctionVariableType];
