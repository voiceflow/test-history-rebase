import { createEmpty, type Normalized } from 'normal-store';

import type { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

export const STATE_KEY = 'document';

export interface DocumentState extends Normalized<KnowledgeBaseDocument> {
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
  processingDocumentIDs: string[];
}

export const INITIAL_STATE: DocumentState = {
  ...createEmpty(),
  fetchStatus: 'idle',
  processingDocumentIDs: [],
};
