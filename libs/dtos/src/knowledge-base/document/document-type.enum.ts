import type { Enum } from '@/utils/type/enum.util';

export const KnowledgeBaseDocumentType = {
  PDF: 'pdf',
  TEXT: 'text',
  URL: 'url',
  DOCX: 'docx',
  TABLE: 'table',
} as const;

export type KnowledgeBaseDocumentType = Enum<typeof KnowledgeBaseDocumentType>;
