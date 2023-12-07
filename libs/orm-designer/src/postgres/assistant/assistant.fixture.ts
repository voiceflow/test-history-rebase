import type { EntityDTO } from '@mikro-orm/core';

import type { AssistantEntity } from './assistant.entity';

export const assistant: EntityDTO<AssistantEntity> = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedByID: 1,
  name: 'first assistant',
  activePersona: { id: 'persona-1' } as any,
  workspace: { id: 1 } as any,
  activeEnvironmentID: 'environment-1',
};

export const assistantList: EntityDTO<AssistantEntity>[] = [
  assistant,
  {
    ...assistant,
    id: '2',
    name: 'second assistant',
  },
];
