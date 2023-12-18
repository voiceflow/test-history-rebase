import type { Assistant } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

import type { assistantReducer } from './assistant.reducer';

export interface AssistantOnlyState extends Normalized<Assistant> {}

export const STATE_KEY = 'assistant';

export type AssistantState = typeof assistantReducer;
