import type { ToJSON, ToObject } from '@/types';

import type { ConditionPredicateEntity } from './condition-predicate.entity';

export type ConditionPredicateObject = ToObject<ConditionPredicateEntity>;
export type ConditionPredicateJSON = ToJSON<ConditionPredicateObject>;
