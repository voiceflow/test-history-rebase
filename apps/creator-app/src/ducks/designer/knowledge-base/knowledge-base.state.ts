import { BaseModels } from '@voiceflow/base-types';

import type { knowledgeBaseReducer } from './knowledge-base.reducer';

export interface KnowledgeBaseOnlyState {
  settings: BaseModels.Project.KnowledgeBaseSettings | null;
}

export const STATE_KEY = 'knowledge-base';

export type KnowledgeBaseState = typeof knowledgeBaseReducer;

export const INITIAL_STATE: KnowledgeBaseOnlyState = {
  settings: null,
};
