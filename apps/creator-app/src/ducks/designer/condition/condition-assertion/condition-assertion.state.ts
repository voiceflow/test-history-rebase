import type { ConditionAssertion } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'assertion';

export interface ConditionAssertionState extends Normalized<ConditionAssertion> {}
