import { ArrayType, Collection, Entity, Enum, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowEntity } from '../flow';
import { StoryJSONAdapter } from './story.adapter';
import { StoryStatus } from './story-status.enum';
import type { BaseTriggerEntity } from './trigger/trigger.entity';

@Entity({ tableName: 'designer.story' })
@Unique({ properties: ['id', 'environmentID'] })
export class StoryEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<StoryEntity>>>(data: JSON) {
    return StoryJSONAdapter.toDB<JSON>(data);
  }

  @Enum({ items: () => StoryStatus, default: null })
  status: StoryStatus | null;

  @ManyToOne(() => FlowEntity, {
    name: 'flow_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['flow_id', 'environment_id'],
  })
  flow: Ref<FlowEntity> | null;

  @Property()
  isStart: boolean;

  @OneToMany('BaseTriggerEntity', (value: BaseTriggerEntity) => value.story)
  triggers = new Collection<BaseTriggerEntity>(this);

  @Property()
  isEnabled: boolean;

  @ManyToOne(() => UserStubEntity, {
    name: 'assignee_id',
    default: null,
    onDelete: 'set default',
  })
  assignee: Ref<UserStubEntity> | null;

  @Property({ default: null })
  description: string | null;

  @Property({ type: ArrayType })
  triggerOrder: string[];

  constructor({
    flowID,
    status,
    isStart,
    isEnabled,
    assigneeID,
    description,
    triggerOrder,
    ...data
  }: EntityCreateParams<StoryEntity>) {
    super(data);

    ({
      flow: this.flow,
      status: this.status,
      isStart: this.isStart,
      assignee: this.assignee,
      isEnabled: this.isEnabled,
      description: this.description,
      triggerOrder: this.triggerOrder,
    } = StoryEntity.fromJSON({
      flowID,
      status,
      isStart,
      isEnabled,
      assigneeID,
      description,
      triggerOrder,
    }));
  }

  toJSON(): ToJSONWithForeignKeys<StoryEntity> {
    return StoryJSONAdapter.fromDB({
      ...this.wrap<StoryEntity>(),
      flow: this.flow,
      folder: this.folder,
      assignee: this.assignee,
      assistant: this.assistant,
    });
  }
}
