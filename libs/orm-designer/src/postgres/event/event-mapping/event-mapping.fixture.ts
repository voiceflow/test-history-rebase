import type { EntityDTO } from '@mikro-orm/core';

import type { EventMappingEntity } from './event-mapping.entity';

export const eventMapping: EntityDTO<EventMappingEntity> = {
  id: 'event-mapping-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  path: ['path.to.data'],
  event: { id: 'event-1' } as any,
  variable: { id: 'variable-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const eventMappingList: EntityDTO<EventMappingEntity>[] = [
  eventMapping,
  {
    ...eventMapping,
    id: 'event-mapping-2',
    variable: { id: 'variable-2' } as any,
  },
];
