/* eslint-disable max-classes-per-file */
import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import { PostgresCMSObjectUnionORM } from '@/postgres/common/postgres-union.orm';
import type { PKOrEntity } from '@/types';

import type { AnyStoryTriggerEntity } from './story-trigger.entity';
import { BaseStoryTriggerEntity, EventStoryTriggerEntity, IntentStoryTriggerEntity } from './story-trigger.entity';

export class StoryTriggerORM extends PostgresCMSObjectUnionORM(
  BaseStoryTriggerEntity,
  EventStoryTriggerEntity,
  IntentStoryTriggerEntity
) {
  findManyByEnvironment(
    assistant: PKOrEntity<AssistantEntity>,
    environmentID: string
  ): Promise<AnyStoryTriggerEntity[]> {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}

export class EventStoryTriggerORM extends PostgresCMSObjectORM(EventStoryTriggerEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}

export class IntentStoryTriggerORM extends PostgresCMSObjectORM(IntentStoryTriggerEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
