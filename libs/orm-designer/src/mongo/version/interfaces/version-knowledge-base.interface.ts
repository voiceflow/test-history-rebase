import type {
  VersionKnowledgeBase as BaseVersionKnowledgeBase,
  VersionKnowledgeBaseDocument as BaseVersionKnowledgeBaseDocument,
  VersionKnowledgeBaseSetFaq as BaseVersionKnowledgeBaseSetFaq,
} from '@voiceflow/dtos';

export interface VersionKnowledgeBaseDocument extends Omit<BaseVersionKnowledgeBaseDocument, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBaseSetFaq extends Omit<BaseVersionKnowledgeBaseSetFaq, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBase extends Omit<BaseVersionKnowledgeBase, 'faqSets' | 'documents'> {
  faqSets?: Record<string, VersionKnowledgeBaseSetFaq>;
  documents?: Record<string, VersionKnowledgeBaseDocument>;
}
