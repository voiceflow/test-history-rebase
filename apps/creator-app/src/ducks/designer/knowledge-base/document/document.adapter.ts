import type { BaseModels } from '@voiceflow/base-types';
import type { KBDocumentData, KnowledgeBaseDocument as RealtimeKnowledgeBaseDocument } from '@voiceflow/dtos';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBKnowledgeBaseDocument, KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

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

export const documentAdapterRealtime = createMultiAdapter<RealtimeKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ data, status, updatedAt, ...rest }) => ({
    ...rest,
    updatedAt: updatedAt || new Date().toString(),
    id: rest.documentID,
    data: data as BaseModels.Project.KnowledgeBaseDocument['data'] | null,
    status: status.type as BaseModels.Project.KnowledgeBaseDocumentStatus,
    folderID: null,
    statusData: status.data,
  }),
  ({ id, data, status, statusData, ...rest }) => ({
    ...rest,
    data: data as KBDocumentData,
    status: { type: status, data: statusData },
    documentID: id,
  })
);
