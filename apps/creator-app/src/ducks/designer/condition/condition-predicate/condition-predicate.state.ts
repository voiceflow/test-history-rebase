import type { ConditionPredicate } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'predicate';

export interface ConditionPredicateState extends Normalized<ConditionPredicate> {}
