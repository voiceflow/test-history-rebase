/* eslint-disable max-classes-per-file */
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import { PostgresCMSObjectUnionORM } from '@/postgres/common/postgres-union.orm';
import type { PKOrEntity } from '@/types';

import type { AnyTriggerEntity } from './trigger.entity';
import { BaseTriggerEntity, EventTriggerEntity, IntentTriggerEntity } from './trigger.entity';

export class TriggerORM extends PostgresCMSObjectUnionORM(BaseTriggerEntity, EventTriggerEntity, IntentTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyTriggerEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}

export class EventTriggerORM extends PostgresCMSObjectORM(EventTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}

export class IntentTriggerORM extends PostgresCMSObjectORM(IntentTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
