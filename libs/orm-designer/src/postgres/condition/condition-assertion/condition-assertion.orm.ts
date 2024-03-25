import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { ConditionAssertionEntity } from './condition-assertion.entity';
import { ConditionAssertionJSONAdapter } from './condition-assertion-json.adapter';

export class ConditionAssertionORM extends PostgresCMSObjectORM<ConditionAssertionEntity> {
  Entity = ConditionAssertionEntity;

  jsonAdapter = ConditionAssertionJSONAdapter;
}
