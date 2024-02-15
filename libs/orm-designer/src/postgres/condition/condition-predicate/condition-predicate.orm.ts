import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { ConditionPredicateEntity } from './condition-predicate.entity';

export class ConditionPredicateORM extends PostgresCMSObjectORM(ConditionPredicateEntity) {}
