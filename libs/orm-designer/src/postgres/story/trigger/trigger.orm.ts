/* eslint-disable max-classes-per-file */
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import { PostgresCMSUnionORM } from '@/postgres/common/postgres-union.orm';
import type { PKOrEntity } from '@/types';

import type { AnyTriggerEntity } from './trigger.entity';
import { BaseTriggerEntity, EventTriggerEntity, IntentTriggerEntity } from './trigger.entity';

export class TriggerORM extends PostgresCMSUnionORM(BaseTriggerEntity, EventTriggerEntity, IntentTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyTriggerEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}

export class EventTriggerORM extends PostgresCMSMutableORM(EventTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}

export class IntentTriggerORM extends PostgresCMSMutableORM(IntentTriggerEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
