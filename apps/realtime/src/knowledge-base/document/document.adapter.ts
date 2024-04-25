import { KnowledgeBaseDocument } from '@voiceflow/dtos';
import { VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import { createMultiAdapter } from 'bidirectional-adapter';

export const knowledgeBaseDocumentAdapter = createMultiAdapter<VersionKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ updatedAt, ...document }) => ({
    ...document,
    updatedAt: updatedAt?.toISOString(),
  }),
  ({ updatedAt, ...document }) => ({
    ...document,
    updatedAt: updatedAt ? new Date(updatedAt) : undefined,
  })
);
