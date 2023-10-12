import type { EntityDTO } from '@mikro-orm/core';

import type { EventTriggerEntity, IntentTriggerEntity } from './trigger.entity';
import { TriggerTarget } from './trigger-target.enum';

const baseTrigger = {
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  story: { id: 'story-1' } as any,
  assistant: { id: 'assistant-1' } as any,
};

export const eventTrigger: EntityDTO<EventTriggerEntity> = {
  ...baseTrigger,
  id: 'trigger-1',
  name: 'event trigger',
  target: TriggerTarget.EVENT,
  event: { id: 'event-1' } as any,
  environmentID: 'environment-1',
};

export const intentTrigger: EntityDTO<IntentTriggerEntity> = {
  ...baseTrigger,
  id: 'trigger-2',
  name: 'intent trigger',
  target: TriggerTarget.INTENT,
  intent: { id: 'intent-1' } as any,
  environmentID: 'environment-1',
};

export const triggerList = [eventTrigger, intentTrigger];
