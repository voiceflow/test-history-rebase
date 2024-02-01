import type { EntityDTO } from '@mikro-orm/core';

import type { EventEntity } from './event.entity';
import { eventMappingList } from './event-mapping/event-mapping.fixture';

export const event: EntityDTO<EventEntity> = {
  id: 'event-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first event',
  requestName: 'foo_event',
  description: 'event description',
  mappings: eventMappingList,
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
  environmentID: 'environment-1',
};

export const eventList: EntityDTO<EventEntity>[] = [
  event,
  {
    ...event,
    id: 'event-2',
    name: 'second event',
    description: null,
    requestName: 'bar_event',
  },
];
