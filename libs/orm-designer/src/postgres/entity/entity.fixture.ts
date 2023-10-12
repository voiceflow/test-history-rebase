import type { EntityDTO } from '@mikro-orm/core';

import type { EntityEntity } from './entity.entity';
import { entityVariantList } from './entity-variant/entity-variant.fixture';

export const entity: EntityDTO<EntityEntity> = {
  id: 'entity-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  name: 'first entity',
  color: '#000000',
  classifier: 'arizona phone number',
  isArray: false,
  variants: [],
  assistant: { id: 'assistant-1' } as any,
  folder: null,
  createdByID: 1,
  updatedByID: 2,
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
    variants: entityVariantList,
  },
];
