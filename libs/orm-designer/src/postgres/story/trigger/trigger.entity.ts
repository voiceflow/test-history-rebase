import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EventEntity } from '@/postgres/event';
import { IntentEntity } from '@/postgres/intent';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { StoryEntity } from '../story.entity';
import { TriggerTarget } from './trigger-target.enum';

const TABLE_NAME = 'designer.trigger';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'target',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseTriggerEntity extends PostgresCMSObjectEntity {
  static resolveBaseForeignKeys<Entity extends BaseTriggerEntity, Data extends ResolveForeignKeysParams<Entity>>({
    storyID,
    assistantID,
    environmentID,
    ...data
  }: Data & ResolveForeignKeysParams<BaseTriggerEntity>) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(storyID !== undefined && { story: ref(StoryEntity, { id: storyID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<Entity, Data>;
  }

  static resolveForeignKeys(data: ResolveForeignKeysParams<BaseTriggerEntity>) {
    return this.resolveBaseForeignKeys(data);
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
    } = BaseTriggerEntity.resolveBaseForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      storyID: this.story.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: TriggerTarget.EVENT,
})
export class EventTriggerEntity extends BaseTriggerEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<EventTriggerEntity>>({ eventID, ...data }: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
      ...(eventID !== undefined &&
        data.environmentID !== undefined && {
          event: eventID ? ref(EventEntity, { id: eventID, environmentID: data.environmentID }) : null,
        }),
    } as ResolvedForeignKeys<EventTriggerEntity, Data>;
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

    ({ event: this.event } = EventTriggerEntity.resolveForeignKeys({ eventID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      eventID: this.event.id,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: TriggerTarget.INTENT,
})
export class IntentTriggerEntity extends BaseTriggerEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<IntentTriggerEntity>>({ intentID, ...data }: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
      ...(intentID !== undefined &&
        data.environmentID !== undefined && {
          intent: intentID ? ref(EventEntity, { id: intentID, environmentID: data.environmentID }) : null,
        }),
    } as ResolvedForeignKeys<IntentTriggerEntity, Data>;
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

    ({ intent: this.intent } = IntentTriggerEntity.resolveForeignKeys({ intentID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      intentID: this.intent.id,
    };
  }
}

export type AnyTriggerEntity = EventTriggerEntity | IntentTriggerEntity;
