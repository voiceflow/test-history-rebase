import { BaseModels } from '@voiceflow/base-types';

export type downloadFileType = BaseModels.Project.KnowledgeBaseDocumentType.DOCX | BaseModels.Project.KnowledgeBaseDocumentType.PDF;

export const MIME_FILE_TYPE = {
  [BaseModels.Project.KnowledgeBaseDocumentType.DOCX]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [BaseModels.Project.KnowledgeBaseDocumentType.PDF]: 'application/pdf',
};
