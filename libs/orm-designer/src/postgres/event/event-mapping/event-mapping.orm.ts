import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { EventMappingEntity } from './event-mapping.entity';

export class EventMappingORM extends PostgresCMSObjectORM(EventMappingEntity) {}
