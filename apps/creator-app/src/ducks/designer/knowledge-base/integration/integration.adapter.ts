import { createMultiAdapter } from 'bidirectional-adapter';

import { DBKnowledgeBaseIntegration, KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

export const integrationAdapter = createMultiAdapter<DBKnowledgeBaseIntegration, KnowledgeBaseIntegration>(
  ({ ...rest }) => ({
    ...rest,
    id: `${rest.creatorID}-${rest.type}`,
  }),
  ({ id, ...rest }) => ({
    ...rest,
  })
);
