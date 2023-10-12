import type { EntityDTO } from '@mikro-orm/core';

import type { StoryEntity } from './story.entity';
import { StoryStatus } from './story-status.enum';
import { triggerList } from './trigger/trigger.fixture';

export const story: EntityDTO<StoryEntity> = {
  id: 'story-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  name: 'first story',
  description: 'flow description',
  status: StoryStatus.IN_PROGRESS,
  isEnabled: true,
  isStart: true,
  assignee: { id: 1 } as any,
  triggerOrder: ['trigger-1', 'trigger-2'],
  triggers: triggerList,
  assistant: { id: 'assistant-1' } as any,
  flow: { id: 'flow-1' } as any,
  createdByID: 1,
  updatedByID: 2,
  folder: null,
  environmentID: 'environment-1',
};

export const storyList: EntityDTO<StoryEntity>[] = [
  story,
  {
    ...story,
    id: 'story-2',
    name: 'second story',
    description: null,
    isStart: false,
    flow: { id: 'flow-2' } as any,
  },
];
