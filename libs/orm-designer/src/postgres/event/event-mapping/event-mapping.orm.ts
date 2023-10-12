import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';

import { EventMappingEntity } from './event-mapping.entity';

export class EventMappingORM extends PostgresCMSMutableORM(EventMappingEntity) {}
