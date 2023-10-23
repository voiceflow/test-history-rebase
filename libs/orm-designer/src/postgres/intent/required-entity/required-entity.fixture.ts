import type { EntityDTO } from '@mikro-orm/core';

import type { RequiredEntityEntity } from './required-entity.entity';

export const requiredEntity: EntityDTO<RequiredEntityEntity> = {
  id: 'required-entity-1',
  createdAt: new Date(),
  reprompt: { id: 'reprompt-1' } as any,
  entity: { id: 'entity-1' } as any,
  intent: { id: 'intent-1' } as any,
  assistant: { id: 'assistant-id' } as any,
  environmentID: 'environment-id',
};

export const requiredEntityList: EntityDTO<RequiredEntityEntity>[] = [
  requiredEntity,
  {
    ...requiredEntity,
    id: 'required-entity-2',
    reprompt: null,
    entity: { id: 'entity-2' } as any,
  },
];
