import { BaseModels } from '@voiceflow/base-types';

export const DOCUMENT_TYPE_MIME_FILE_TYPE_MAP: Record<BaseModels.Project.KnowledgeBaseDocumentType, string> = {
  [BaseModels.Project.KnowledgeBaseDocumentType.URL]: 'text/plain',
  [BaseModels.Project.KnowledgeBaseDocumentType.PDF]: 'application/pdf',
  [BaseModels.Project.KnowledgeBaseDocumentType.DOCX]:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [BaseModels.Project.KnowledgeBaseDocumentType.TEXT]: 'text/plain',
  [BaseModels.Project.KnowledgeBaseDocumentType.TABLE]: 'application/json',
};
