import type { AnyCondition } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'condition';

export interface ConditionState extends Normalized<AnyCondition> {}
