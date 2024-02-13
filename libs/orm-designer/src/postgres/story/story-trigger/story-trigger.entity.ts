import { Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EventEntity } from '@/postgres/event';
import { IntentEntity } from '@/postgres/intent';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { StoryEntity } from '../story.entity';
import {
  BaseStoryTriggerJSONAdapter,
  EventStoryTriggerJSONAdapter,
  IntentStoryTriggerJSONAdapter,
} from './story-trigger.adapter';
import { StoryTriggerTarget } from './story-trigger-target.enum';

const TABLE_NAME = 'designer.trigger';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'target',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseStoryTriggerEntity extends PostgresCMSObjectEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseStoryTriggerEntity>>) {
    return BaseStoryTriggerJSONAdapter.toDB(data);
  }

  @Property()
  name: string;

  @ManyToOne(() => StoryEntity, {
    name: 'story_id',
    onDelete: 'cascade',
    fieldNames: ['story_id', 'environment_id'],
  })
  story: Ref<StoryEntity>;

  @Enum(() => StoryTriggerTarget)
  target: StoryTriggerTarget;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseStoryTriggerEntity>) {
    super(data);

    ({
      name: this.name,
      story: this.story,
      target: this.target,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = BaseStoryTriggerEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BaseStoryTriggerEntity> {
    return BaseStoryTriggerJSONAdapter.fromDB({
      ...wrap<BaseStoryTriggerEntity>(this).toObject(...args),
      story: this.story,
      assistant: this.assistant,
      updatedBy: this.updatedBy,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: StoryTriggerTarget.EVENT,
})
export class EventStoryTriggerEntity extends BaseStoryTriggerEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EventStoryTriggerEntity>>>(data: JSON) {
    return EventStoryTriggerJSONAdapter.toDB<JSON>(data);
  }

  target: typeof StoryTriggerTarget.EVENT = StoryTriggerTarget.EVENT;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    onDelete: 'cascade',
    fieldNames: ['event_id', 'environment_id'],
  })
  event: Ref<EventEntity>;

  constructor({ eventID, ...data }: EntityCreateParams<EventStoryTriggerEntity, 'target'>) {
    super({ ...data, target: StoryTriggerTarget.EVENT });

    ({ event: this.event } = EventStoryTriggerEntity.fromJSON({ eventID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EventStoryTriggerEntity> {
    return EventStoryTriggerJSONAdapter.fromDB({
      ...wrap<EventStoryTriggerEntity>(this).toObject(...args),
      story: this.story,
      event: this.event,
      assistant: this.assistant,
      updatedBy: this.updatedBy,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: StoryTriggerTarget.INTENT,
})
export class IntentStoryTriggerEntity extends BaseStoryTriggerEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<IntentStoryTriggerEntity>>>(data: JSON) {
    return IntentStoryTriggerJSONAdapter.toDB<JSON>(data);
  }

  target: typeof StoryTriggerTarget.INTENT = StoryTriggerTarget.INTENT;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent: Ref<IntentEntity>;

  constructor({ intentID, ...data }: EntityCreateParams<IntentStoryTriggerEntity, 'target'>) {
    super({ ...data, target: StoryTriggerTarget.INTENT });

    ({ intent: this.intent } = IntentStoryTriggerEntity.fromJSON({ intentID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<IntentStoryTriggerEntity> {
    return IntentStoryTriggerJSONAdapter.fromDB({
      ...wrap<IntentStoryTriggerEntity>(this).toObject(...args),
      story: this.story,
      intent: this.intent,
      assistant: this.assistant,
      updatedBy: this.updatedBy,
    });
  }
}

export type AnyStoryTriggerEntity = EventStoryTriggerEntity | IntentStoryTriggerEntity;
