import type { Enum } from '@/utils/type/enum.util';

export const IntentClassificationType = {
  LLM: 'llm',
  NLU: 'nlu',
} as const;

export type IntentClassificationType = Enum<typeof IntentClassificationType>;
