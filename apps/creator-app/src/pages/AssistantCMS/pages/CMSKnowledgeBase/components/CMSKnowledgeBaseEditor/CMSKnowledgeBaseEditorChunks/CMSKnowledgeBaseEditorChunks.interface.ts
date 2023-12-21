import { DBKnowledgeBaseDocumentChunk } from '@/models/KnowledgeBase.model';

export interface ICMSKnowledgeBaseEditorChunks {
  chunks?: DBKnowledgeBaseDocumentChunk[];
  disabled?: boolean;
}
