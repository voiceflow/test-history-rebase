import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { EventMappingEntity } from './event-mapping.entity';
import { EventMappingJSONAdapter } from './event-mapping-json.adapter';

export class EventMappingORM extends PostgresCMSObjectORM<EventMappingEntity> {
  Entity = EventMappingEntity;

  jsonAdapter = EventMappingJSONAdapter;
}
