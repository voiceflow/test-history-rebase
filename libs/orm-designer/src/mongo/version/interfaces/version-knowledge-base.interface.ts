import type {
  KnowledgeBaseDocument,
  VersionKnowledgeBase as BaseVersionKnowledgeBase,
  VersionKnowledgeBaseSetFaq as BaseVersionKnowledgeBaseSetFaq,
} from '@voiceflow/dtos';

export interface VersionKnowledgeBaseDocument extends Omit<KnowledgeBaseDocument, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBaseSetFaq extends Omit<BaseVersionKnowledgeBaseSetFaq, 'updatedAt'> {
  updatedAt?: Date;
}

export interface VersionKnowledgeBase extends Omit<BaseVersionKnowledgeBase, 'faqSets' | 'documents' | 'settings'> {
  faqSets?: Record<string, VersionKnowledgeBaseSetFaq>;
  documents?: Record<string, VersionKnowledgeBaseDocument>;
}
