import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import { DBKnowledgeBaseDocument, KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

export const documentAdapter = createMultiAdapter<DBKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ data, status, ...rest }) => ({
    ...rest,
    id: rest.documentID,
    data,
    status: status.type,
    statusData: status.data,
  }),
  notImplementedAdapter.transformer
);
