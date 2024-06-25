import { createEmpty, type Normalized } from 'normal-store';

import type { KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

export interface KnowledgeBaseIntegrationState extends Normalized<KnowledgeBaseIntegration> {}

export const STATE_KEY = 'knowledge-base-integration';

export const INITIAL_STATE: KnowledgeBaseIntegrationState = {
  ...createEmpty(),
};
