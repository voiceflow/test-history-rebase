import type { ConditionPredicate } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'predicate';

export interface ConditionPredicateState extends Normalized<ConditionPredicate> {}
