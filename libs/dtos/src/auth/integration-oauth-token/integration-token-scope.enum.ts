import type { Enum } from '@/utils/type/enum.util';

export const IntegrationTokenScope = {
  USER: 'user',
  WORKSPACE: 'workspace',
  ASSISTANT: 'assistant',
} as const;

export type IntegrationTokenScope = Enum<typeof IntegrationTokenScope>;
