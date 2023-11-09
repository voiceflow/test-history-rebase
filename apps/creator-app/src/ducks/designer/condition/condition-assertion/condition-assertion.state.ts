import type { ConditionAssertion } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'assertion';

export interface ConditionAssertionState extends Normalized<ConditionAssertion> {}
