import type { Flow } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

import type { flowReducer } from './flow.reducer';

export const STATE_KEY = 'flow';

export interface FlowOnlyState extends Normalized<Flow> {}

export type FlowState = typeof flowReducer;
