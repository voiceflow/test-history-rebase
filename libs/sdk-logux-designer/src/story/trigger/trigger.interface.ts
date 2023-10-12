import type { ObjectResource } from '@/common';

import type { TriggerTarget } from './trigger-target.enum';

interface BaseTrigger extends ObjectResource {
  name: string;
  storyID: string;
  assistantID: string;
}

export interface EventTrigger extends BaseTrigger {
  target: TriggerTarget.EVENT;
  eventID: string;
}

export interface IntentTrigger extends BaseTrigger {
  target: TriggerTarget.INTENT;
  intentID: string;
}

export type AnyTrigger = EventTrigger | IntentTrigger;
