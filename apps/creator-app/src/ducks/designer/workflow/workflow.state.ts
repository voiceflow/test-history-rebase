import type { Workflow } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

import type { workflowReducer } from './workflow.reducer';

export const STATE_KEY = 'workflow';

export interface WorkflowOnlyState extends Normalized<Workflow> {}

export type WorkflowState = typeof workflowReducer;
