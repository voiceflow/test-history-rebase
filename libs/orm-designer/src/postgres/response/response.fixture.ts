import type { EntityDTO } from '@mikro-orm/core';

import type { ResponseEntity } from './response.entity';
import { responseDiscriminatorList } from './response-discriminator/response-discriminator.fixture';

export const response: EntityDTO<ResponseEntity> = {
  id: 'response-1',
  environmentID: 'environment-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first response',
  responses: responseDiscriminatorList,
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
};

export const responseList: EntityDTO<ResponseEntity>[] = [
  response,
  {
    ...response,
    id: 'response-2',
    name: 'second response',
  },
];
