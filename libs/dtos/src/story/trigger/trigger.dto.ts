import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { TriggerTarget } from './trigger-target.enum';

const BaseTriggerDTO = CMSObjectResourceDTO.extend({
  name: z.string().min(1, 'Name is required.').max(255, 'Name is too long.'),
  target: z.nativeEnum(TriggerTarget),
  storyID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export const EventTriggerDTO = BaseTriggerDTO.extend({
  target: z.literal(TriggerTarget.EVENT),
  eventID: z.string(),
}).strict();

export type EventTrigger = z.infer<typeof EventTriggerDTO>;

export const IntentTriggerDTO = BaseTriggerDTO.extend({
  target: z.literal(TriggerTarget.INTENT),
  intentID: z.string(),
}).strict();

export type IntentTrigger = z.infer<typeof IntentTriggerDTO>;

export const AnyTriggerDTO = z.union([EventTriggerDTO, IntentTriggerDTO]);

export type AnyTrigger = z.infer<typeof AnyTriggerDTO>;
