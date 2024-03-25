import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { ConditionPredicateEntity } from './condition-predicate.entity';
import { ConditionPredicateEntityAdapter } from './condition-predicate-json.adapter';

export class ConditionPredicateORM extends PostgresCMSObjectORM<ConditionPredicateEntity> {
  Entity = ConditionPredicateEntity;

  jsonAdapter = ConditionPredicateEntityAdapter;
}
