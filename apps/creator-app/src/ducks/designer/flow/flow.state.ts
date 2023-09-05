import type { Flow } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

import type { flowReducer } from './flow.reducer';

export const STATE_KEY = 'flow';

export interface FlowOnlyState extends Normalized<Flow> {}

export type FlowState = typeof flowReducer;
