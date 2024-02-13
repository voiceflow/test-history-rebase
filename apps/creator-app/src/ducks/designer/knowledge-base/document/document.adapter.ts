import { createMultiAdapter } from 'bidirectional-adapter';

import { DBKnowledgeBaseDocument, KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

export const documentAdapter = createMultiAdapter<DBKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ data, status, ...rest }) => ({
    ...rest,
    id: rest.documentID,
    data,
    status: status.type,
    folderID: null,
    statusData: status.data,
  }),
  ({ id, data, status, statusData, ...rest }) => ({
    ...rest,
    data,
    status: { type: status, data: statusData },
    documentID: id,
  })
);
