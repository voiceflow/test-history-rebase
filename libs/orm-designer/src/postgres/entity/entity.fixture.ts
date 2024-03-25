import type { EntityDTO } from '@mikro-orm/core';

import type { EntityEntity } from './entity.entity';

export const entity: EntityDTO<EntityEntity> = {
  id: 'entity-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first entity',
  color: '#000000',
  classifier: 'arizona phone number',
  isArray: false,
  assistant: { id: 'assistant-1' } as any,
  folder: null,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  description: null,
  environmentID: 'environment-1',
};

export const entityList: EntityDTO<EntityEntity>[] = [
  entity,
  {
    ...entity,
    id: 'entity-2',
    name: 'second entity',
    classifier: null,
  },
];
