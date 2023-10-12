import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';

import { ConditionPredicateEntity } from './condition-predicate.entity';

export class ConditionPredicateORM extends PostgresCMSMutableORM(ConditionPredicateEntity) {}
