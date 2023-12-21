import { BaseModels } from '@voiceflow/base-types';

export interface DBKnowledgeBaseDocumentChunk {
  chunkID: string;
  content: string;
}

export interface DBKnowledgeBaseDocument extends Omit<BaseModels.Project.KnowledgeBaseDocument, 'data' | 'updatedAt'> {
  data: BaseModels.Project.KnowledgeBaseDocument['data'] | null;
  chunks?: DBKnowledgeBaseDocumentChunk[];
  updatedAt: string;
  statusData: unknown;
}

export interface KnowledgeBaseDocument extends Omit<DBKnowledgeBaseDocument, 'status'> {
  id: string;
  status: BaseModels.Project.KnowledgeBaseDocumentStatus;
  statusData: unknown;
}
