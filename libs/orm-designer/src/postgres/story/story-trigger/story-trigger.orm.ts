/* eslint-disable max-classes-per-file */
import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { BaseStoryTriggerEntity, EventStoryTriggerEntity, IntentStoryTriggerEntity } from './story-trigger.entity';
import type { AnyStoryTriggerEntity } from './story-trigger.interface';
import {
  BaseStoryTriggerJSONAdapter,
  EventStoryTriggerJSONAdapter,
  IntentStoryTriggerJSONAdapter,
} from './story-trigger-json.adapter';

export class EventStoryTriggerORM extends PostgresCMSObjectORM<EventStoryTriggerEntity> {
  Entity = EventStoryTriggerEntity;

  jsonAdapter = EventStoryTriggerJSONAdapter;

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }
}

export class IntentStoryTriggerORM extends PostgresCMSObjectORM<IntentStoryTriggerEntity> {
  Entity = IntentStoryTriggerEntity;

  jsonAdapter = IntentStoryTriggerJSONAdapter;

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }
}

export class AnyStoryTriggerORM extends PostgresCMSObjectORM<BaseStoryTriggerEntity, AnyStoryTriggerEntity> {
  Entity = BaseStoryTriggerEntity;

  jsonAdapter = BaseStoryTriggerJSONAdapter;

  protected discriminators = [
    { Entity: EventStoryTriggerEntity, jsonAdapter: EventStoryTriggerJSONAdapter },
    { Entity: IntentStoryTriggerEntity, jsonAdapter: IntentStoryTriggerJSONAdapter },
  ];

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }
}
