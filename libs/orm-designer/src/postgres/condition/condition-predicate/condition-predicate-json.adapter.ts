import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { ConditionPredicateJSON, ConditionPredicateObject } from './condition-predicate.interface';

export const ConditionPredicateEntityAdapter = createSmartMultiAdapter<
  ConditionPredicateObject,
  ConditionPredicateJSON
>(PostgresCMSObjectJSONAdapter.fromDB, PostgresCMSObjectJSONAdapter.toDB);
