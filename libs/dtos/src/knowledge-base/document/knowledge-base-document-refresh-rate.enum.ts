import type { Enum } from '@/utils/type/enum.util';

export const KnowledgeBaseDocumentRefreshRate = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  NEVER: 'never',
} as const;

export type KnowledgeBaseDocumentRefreshRate = Enum<typeof KnowledgeBaseDocumentRefreshRate>;
