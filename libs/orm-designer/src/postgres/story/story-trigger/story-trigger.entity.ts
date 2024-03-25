import { Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import { StoryTriggerTarget } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EventEntity } from '@/postgres/event';
import { IntentEntity } from '@/postgres/intent';
import type { CMSCompositePK, Ref } from '@/types';

import { StoryEntity } from '../story.entity';

const TABLE_NAME = 'designer.trigger';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'target',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseStoryTriggerEntity extends PostgresCMSObjectEntity {
  @Property()
  name!: string;

  @ManyToOne(() => StoryEntity, {
    name: 'story_id',
    onDelete: 'cascade',
    fieldNames: ['story_id', 'environment_id'],
  })
  story!: Ref<StoryEntity>;

  @Enum(() => StoryTriggerTarget)
  target!: StoryTriggerTarget;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyType]?: CMSCompositePK;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: StoryTriggerTarget.EVENT,
})
export class EventStoryTriggerEntity extends BaseStoryTriggerEntity {
  target!: typeof StoryTriggerTarget.EVENT;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    onDelete: 'cascade',
    fieldNames: ['event_id', 'environment_id'],
  })
  event!: Ref<EventEntity>;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: StoryTriggerTarget.INTENT,
})
export class IntentStoryTriggerEntity extends BaseStoryTriggerEntity {
  target!: typeof StoryTriggerTarget.INTENT;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent!: Ref<IntentEntity>;
}
