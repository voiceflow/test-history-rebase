import type { TriggerTarget } from '@voiceflow/orm-designer';

import type { CreateOneData } from '@/common/types';

import type { EventTriggerService } from './event-trigger.service';
import type { IntentTriggerService } from './intent-trigger.service';

export interface TriggerEventCreateData extends CreateOneData<EventTriggerService> {
  target: typeof TriggerTarget.EVENT;
}

export interface TriggerIntentCreateData extends CreateOneData<IntentTriggerService> {
  target: typeof TriggerTarget.INTENT;
}

export type TriggerAnyCreateData = TriggerEventCreateData | TriggerIntentCreateData;
