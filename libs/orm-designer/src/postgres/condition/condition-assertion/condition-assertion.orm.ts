import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';

import { ConditionAssertionEntity } from './condition-assertion.entity';

export class ConditionAssertionORM extends PostgresCMSMutableORM(ConditionAssertionEntity) {}
