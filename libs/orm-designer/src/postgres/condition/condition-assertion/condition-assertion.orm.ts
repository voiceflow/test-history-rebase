import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';

import { ConditionAssertionEntity } from './condition-assertion.entity';

export class ConditionAssertionORM extends PostgresCMSObjectORM(ConditionAssertionEntity) {}
