import type { EntityDTO } from '@mikro-orm/core';
import { WorkflowStatus } from '@voiceflow/dtos';

import type { WorkflowEntity } from './workflow.entity';

export const story: EntityDTO<WorkflowEntity> = {
  id: 'story-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first story',
  description: 'flow description',
  status: WorkflowStatus.IN_PROGRESS,
  isStart: true,
  assignee: { id: 1 } as any,
  assistant: { id: 'assistant-1' } as any,
  diagramID: 'diagram-1',
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
  environmentID: 'environment-1',
};

export const storyList: EntityDTO<WorkflowEntity>[] = [
  story,
  {
    ...story,
    id: 'story-2',
    name: 'second story',
    description: null,
    isStart: false,
    diagramID: 'diagram-2',
  },
];
