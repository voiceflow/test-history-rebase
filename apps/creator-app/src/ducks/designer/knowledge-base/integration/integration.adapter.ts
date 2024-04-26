import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBKnowledgeBaseIntegration, KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

export const integrationAdapter = createMultiAdapter<DBKnowledgeBaseIntegration, KnowledgeBaseIntegration>(
  ({ ...rest }) => ({
    ...rest,
    id: rest.type,
  }),
  ({ id, ...rest }) => ({
    ...rest,
  })
);
