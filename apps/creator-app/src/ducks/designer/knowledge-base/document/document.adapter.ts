import { BaseModels } from '@voiceflow/base-types';
import { KBDocumentData, KnowledgeBaseDocument as RealtimeKnowledgeBaseDocument } from '@voiceflow/dtos';
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

export const documentAdapterRealtime = createMultiAdapter<RealtimeKnowledgeBaseDocument, KnowledgeBaseDocument>(
  ({ data, status, s3ObjectRef, updatedAt, ...rest }) => ({
    ...rest,
    updatedAt: updatedAt || new Date().toString(),
    id: rest.documentID,
    data: data as BaseModels.Project.KnowledgeBaseDocument['data'] | null,
    status: status.type as BaseModels.Project.KnowledgeBaseDocumentStatus,
    folderID: null,
    statusData: status.data,
    s3ObjectRef: s3ObjectRef || '',
  }),
  ({ id, data, status, statusData, ...rest }) => ({
    ...rest,
    data: data as KBDocumentData,
    status: { type: status, data: statusData },
    documentID: id,
  })
);
