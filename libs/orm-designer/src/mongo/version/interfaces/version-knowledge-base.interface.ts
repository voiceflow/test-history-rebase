import type { AnyRecord } from '@voiceflow/common';

import type { WithAdditionalProperties } from '@/types';

export type VersionKnowledgeBaseDocumentData = WithAdditionalProperties<{
  type?: string;
  name?: string;
}>;

export type VersionKnowledgeBaseDocumentStatus = WithAdditionalProperties<{
  type?: string;
}>;

export interface VersionKnowledgeBaseDocument {
  tags?: string[];
  data?: VersionKnowledgeBaseDocumentData;
  status?: VersionKnowledgeBaseDocumentStatus;
  version?: number;
  updatedAt?: Date;
  creatorID?: number;
  documentID?: string;
  s3ObjectRef?: string;
}

export type VersionKnowledgeBaseSetFaqStatus = WithAdditionalProperties<{
  type?: string;
}>;

export interface VersionKnowledgeBaseSetFaq {
  tags?: string[];
  name?: string;
  status?: VersionKnowledgeBaseSetFaqStatus;
  version?: number;
  faqSetID?: string;
  updatedAt?: Date;
  creatorID?: number;
}

export interface VersionKnowledgeBaseTag {
  tagID: string;
  label: string;
}

export interface VersionKnowledgeBase {
  tags?: Record<string, VersionKnowledgeBaseTag>;
  faqSets?: Record<string, VersionKnowledgeBaseSetFaq>;
  settings?: AnyRecord;
  documents?: Record<string, VersionKnowledgeBaseDocument>;
}
