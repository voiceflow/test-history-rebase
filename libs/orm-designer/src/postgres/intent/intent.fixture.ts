import type { EntityDTO } from '@mikro-orm/core';

import type { IntentEntity } from './intent.entity';
import { requiredEntityList } from './required-entity/required-entity.fixture';
import { utteranceList } from './utterance/utterance.fixture';

export const intent: EntityDTO<IntentEntity> = {
  id: 'intent-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  name: 'first intent',
  description: 'intent description',
  automaticReprompt: true,
  entityOrder: ['entity-1', 'entity-2'],
  utterances: utteranceList,
  requiredEntities: requiredEntityList,
  assistant: { id: 'assistant-1' } as any,
  createdByID: 1,
  updatedByID: 2,
  folder: null,
  environmentID: 'environment-1',
};

export const intentList: EntityDTO<IntentEntity>[] = [
  intent,
  {
    ...intent,
    id: 'intent-2',
    name: 'second intent',
    description: null,
    entityOrder: ['entity-1'],
    requiredEntities: [],
  },
];
