import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EventEntity } from '@/postgres/event';
import { IntentEntity } from '@/postgres/intent';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { StoryEntity } from '../story.entity';
import { BaseTriggerJSONAdapter, EventTriggerJSONAdapter, IntentTriggerJSONAdapter } from './trigger.adapter';
import { TriggerTarget } from './trigger-target.enum';

const TABLE_NAME = 'designer.trigger';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'target',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseTriggerEntity extends PostgresCMSObjectEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseTriggerEntity>>) {
    return BaseTriggerJSONAdapter.toDB(data);
  }

  @Property()
  name: string;

  @ManyToOne(() => StoryEntity, {
    name: 'story_id',
    onDelete: 'cascade',
    fieldNames: ['story_id', 'environment_id'],
  })
  story: Ref<StoryEntity>;

  @Enum(() => TriggerTarget)
  target: TriggerTarget;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseTriggerEntity>) {
    super(data);

    ({
      name: this.name,
      story: this.story,
      target: this.target,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = BaseTriggerEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BaseTriggerEntity> {
    return BaseTriggerJSONAdapter.fromDB({
      ...wrap<BaseTriggerEntity>(this).toObject(...args),
      story: this.story,
      assistant: this.assistant,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: TriggerTarget.EVENT,
})
export class EventTriggerEntity extends BaseTriggerEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EventTriggerEntity>>>(data: JSON) {
    return EventTriggerJSONAdapter.toDB<JSON>(data);
  }

  target: TriggerTarget.EVENT = TriggerTarget.EVENT;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    onDelete: 'cascade',
    fieldNames: ['event_id', 'environment_id'],
  })
  event: Ref<EventEntity>;

  constructor({ eventID, ...data }: EntityCreateParams<EventTriggerEntity, 'target'>) {
    super({ ...data, target: TriggerTarget.EVENT });

    ({ event: this.event } = EventTriggerEntity.fromJSON({ eventID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EventTriggerEntity> {
    return EventTriggerJSONAdapter.fromDB({
      ...wrap<EventTriggerEntity>(this).toObject(...args),
      story: this.story,
      event: this.event,
      assistant: this.assistant,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: TriggerTarget.INTENT,
})
export class IntentTriggerEntity extends BaseTriggerEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<IntentTriggerEntity>>>(data: JSON) {
    return IntentTriggerJSONAdapter.toDB<JSON>(data);
  }

  target: TriggerTarget.INTENT = TriggerTarget.INTENT;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent: Ref<IntentEntity>;

  constructor({ intentID, ...data }: EntityCreateParams<IntentTriggerEntity, 'target'>) {
    super({ ...data, target: TriggerTarget.INTENT });

    ({ intent: this.intent } = IntentTriggerEntity.fromJSON({ intentID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<IntentTriggerEntity> {
    return IntentTriggerJSONAdapter.fromDB({
      ...wrap<IntentTriggerEntity>(this).toObject(...args),
      story: this.story,
      intent: this.intent,
      assistant: this.assistant,
    });
  }
}

export type AnyTriggerEntity = EventTriggerEntity | IntentTriggerEntity;
