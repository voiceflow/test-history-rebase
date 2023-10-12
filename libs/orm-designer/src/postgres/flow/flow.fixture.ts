import type { EntityDTO } from '@mikro-orm/core';

import type { FlowEntity } from './flow.entity';

export const flow: EntityDTO<FlowEntity> = {
  id: 'flow-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  name: 'first flow',
  description: 'flow description',
  diagramID: 'diagram-1',
  assistant: { id: 'assistant-1' } as any,
  createdByID: 1,
  updatedByID: 2,
  folder: null,
  environmentID: 'environment-1',
};

export const flowList: EntityDTO<FlowEntity>[] = [
  flow,
  {
    ...flow,
    id: 'flow-2',
    name: 'second flow',
    description: null,
    diagramID: 'diagram-2',
  },
];
