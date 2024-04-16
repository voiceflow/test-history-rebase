import type { Enum } from '@/utils/type/enum.util';

export const KnowledgeBaseDocumentIntegrationType = {
  ZENDESK: 'zendesk',
} as const;

export type KnowledgeBaseDocumentIntegrationType = Enum<typeof KnowledgeBaseDocumentIntegrationType>;
