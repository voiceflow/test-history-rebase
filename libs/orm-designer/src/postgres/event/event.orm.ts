import { PostgresCMSTabularORM } from '@/postgres/common';

import { EventEntity } from './event.entity';
import { EventJSONAdapter } from './event-json.adapter';

export class EventORM extends PostgresCMSTabularORM<EventEntity> {
  Entity = EventEntity;

  jsonAdapter = EventJSONAdapter;
}
