import type { EntityDTO } from '@mikro-orm/core';

import type { IntentEntity } from './intent.entity';

export const intent: EntityDTO<IntentEntity> = {
  id: 'intent-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first intent',
  description: 'intent description',
  automaticReprompt: true,
  entityOrder: ['entity-1', 'entity-2'],
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
  environmentID: 'environment-1',
  // automaticRepromptSettings: null,
};

export const intentList: EntityDTO<IntentEntity>[] = [
  intent,
  {
    ...intent,
    id: 'intent-2',
    name: 'second intent',
    description: null,
    entityOrder: ['entity-1'],
  },
];
