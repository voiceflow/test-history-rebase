import type { Enum } from '@/utils/type/enum.util';

export const KnowledgeBaseDocumentStatus = {
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  INITIALIZED: 'INITIALIZED',
} as const;

export type KnowledgeBaseDocumentStatus = Enum<typeof KnowledgeBaseDocumentStatus>;
