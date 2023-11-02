import type { WithAdditionalProperties } from '@/types';

export type ProjectAIAssistSettings = WithAdditionalProperties<{
  aiPlayground?: boolean;
  generateNoMatch?: boolean;
}>;
