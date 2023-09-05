import type { AnyCondition } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'condition';

export interface ConditionState extends Normalized<AnyCondition> {}
