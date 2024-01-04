import { createMultiAdapter } from 'bidirectional-adapter';

import { DBKnowledgeBaseDocument, KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

export const documentAdapter = createMultiAdapter<DBKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ data, status, ...rest }) => ({
    ...rest,
    id: rest.documentID,
    data,
    status: status.type,
    statusData: status.data,
  }),
  ({ id, data, status, statusData, ...rest }) => ({
    ...rest,
    documentID: id,
    data,
    status: { type: status, data: statusData },
  })
);
