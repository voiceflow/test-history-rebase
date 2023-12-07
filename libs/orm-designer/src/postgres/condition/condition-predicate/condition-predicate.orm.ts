import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';

import { ConditionPredicateEntity } from './condition-predicate.entity';

export class ConditionPredicateORM extends PostgresCMSObjectORM(ConditionPredicateEntity) {}
