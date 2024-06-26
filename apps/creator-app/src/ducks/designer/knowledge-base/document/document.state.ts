import { createEmpty, type Normalized } from 'normal-store';

import type { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

export const STATE_KEY = 'document';

export interface DocumentState extends Normalized<KnowledgeBaseDocument> {
  count: number;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
  processingIDs: string[];
}

export const INITIAL_STATE: DocumentState = {
  ...createEmpty(),
  count: 0,
  fetchStatus: 'idle',
  processingIDs: [],
};
