import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { StoryTriggerTarget } from './story-trigger-target.enum';

const BaseStoryTriggerDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().max(255, 'Name is too long.'),
    target: z.nativeEnum(StoryTriggerTarget),
    storyID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export const EventStoryTriggerDTO = BaseStoryTriggerDTO.extend({
  target: z.literal(StoryTriggerTarget.EVENT),
  eventID: z.string(),
}).strict();

export type EventStoryTrigger = z.infer<typeof EventStoryTriggerDTO>;

export const IntentStoryTriggerDTO = BaseStoryTriggerDTO.extend({
  target: z.literal(StoryTriggerTarget.INTENT),
  intentID: z.string(),
}).strict();

export type IntentStoryTrigger = z.infer<typeof IntentStoryTriggerDTO>;

export const AnyStoryTriggerDTO = z.union([EventStoryTriggerDTO, IntentStoryTriggerDTO]);

export type AnyStoryTrigger = z.infer<typeof AnyStoryTriggerDTO>;
