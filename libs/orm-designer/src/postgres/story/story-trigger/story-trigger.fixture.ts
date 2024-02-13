import type { EntityDTO } from '@mikro-orm/core';

import type { EventStoryTriggerEntity, IntentStoryTriggerEntity } from './story-trigger.entity';
import { StoryTriggerTarget } from './story-trigger-target.enum';

const baseTrigger = {
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  story: { id: 'story-1' } as any,
  assistant: { id: 'assistant-1' } as any,
};

export const eventStoryTrigger: EntityDTO<EventStoryTriggerEntity> = {
  ...baseTrigger,
  id: 'trigger-1',
  name: 'event trigger',
  target: StoryTriggerTarget.EVENT,
  event: { id: 'event-1' } as any,
  environmentID: 'environment-1',
};

export const intentStoryTrigger: EntityDTO<IntentStoryTriggerEntity> = {
  ...baseTrigger,
  id: 'trigger-2',
  name: 'intent trigger',
  target: StoryTriggerTarget.INTENT,
  intent: { id: 'intent-1' } as any,
  environmentID: 'environment-1',
};

export const storyTriggerList = [eventStoryTrigger, intentStoryTrigger];
