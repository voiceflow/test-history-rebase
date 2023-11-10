export const ConditionType = {
  EXPRESSION: 'expression',
  PROMPT: 'prompt',
  SCRIPT: 'script',
} as const;

export type ConditionType = (typeof ConditionType)[keyof typeof ConditionType];
