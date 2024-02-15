import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowEntity } from '../flow';
import { StoryEntityAdapter } from './story-entity.adapter';
import { StoryStatus } from './story-status.enum';
import type { BaseStoryTriggerEntity } from './story-trigger/story-trigger.entity';

@Entity({ tableName: 'designer.story' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class StoryEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<StoryEntity>>>(data: JSON) {
    return StoryEntityAdapter.toDB<JSON>(data);
  }

  @Enum({ items: () => StoryStatus, default: null, nullable: true })
  status: StoryStatus | null;

  @ManyToOne(() => FlowEntity, {
    name: 'flow_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['flow_id', 'environment_id'],
  })
  flow: Ref<FlowEntity> | null = null;

  @Property()
  isStart: boolean;

  @OneToMany('BaseStoryTriggerEntity', (value: BaseStoryTriggerEntity) => value.story)
  triggers = new Collection<BaseStoryTriggerEntity>(this);

  @Property()
  isEnabled: boolean;

  @ManyToOne(() => UserStubEntity, {
    name: 'assignee_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
  })
  assignee: Ref<UserStubEntity> | null = null;

  @Property({ type: 'text', default: null, nullable: true })
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

  toJSON(...args: any[]): ToJSONWithForeignKeys<StoryEntity> {
    return StoryEntityAdapter.fromDB({
      ...wrap<StoryEntity>(this).toObject(...args),
      flow: this.flow ?? null,
      folder: this.folder ?? null,
      assignee: this.assignee ?? null,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}
