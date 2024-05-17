import type {
  KBDocumentDocxData,
  KBDocumentPDFData,
  KBDocumentTableData,
  KBDocumentTextData,
  KBDocumentUrlData,
  KnowledgeBaseDocument,
  KnowledgeBaseSettings,
  VersionKnowledgeBase as BaseVersionKnowledgeBase,
  VersionKnowledgeBaseSetFaq as BaseVersionKnowledgeBaseSetFaq,
} from '@voiceflow/dtos';

export interface VersionKnowledgeBaseDocument extends Omit<KnowledgeBaseDocument, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBasePatchDocument extends Omit<KnowledgeBaseDocument, 'updatedAt' | 'data'> {
  updatedAt?: Date;
  data?:
    | Partial<KBDocumentPDFData>
    | Partial<KBDocumentUrlData>
    | Partial<KBDocumentTextData>
    | Partial<KBDocumentTableData>
    | Partial<KBDocumentDocxData>;
}

export interface VersionKnowledgeBaseSetFaq extends Omit<BaseVersionKnowledgeBaseSetFaq, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBase extends Omit<BaseVersionKnowledgeBase, 'faqSets' | 'documents' | 'settings'> {
  faqSets?: Record<string, VersionKnowledgeBaseSetFaq>;
  documents?: Record<string, VersionKnowledgeBaseDocument>;
  settings?: KnowledgeBaseSettings;
}
