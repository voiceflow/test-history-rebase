import { ArrayType, Collection, Entity, Enum, ManyToOne, OneToMany, Property, ref, Unique } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowEntity } from '../flow';
import { StoryStatus } from './story-status.enum';
import { BaseTriggerEntity } from './trigger/trigger.entity';

@Entity({ tableName: 'designer.story' })
@Unique({ properties: ['id', 'environmentID'] })
export class StoryEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<StoryEntity>>({
    flowID,
    assigneeID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
      ...(environmentID !== undefined && {
        environmentID,
        ...(flowID !== undefined && { flow: flowID ? ref(FlowEntity, { id: flowID, environmentID }) : null }),
      }),
      ...(assigneeID !== undefined && { assignee: assigneeID ? ref(UserStubEntity, assigneeID) : null }),
    } as ResolvedForeignKeys<StoryEntity, Data>;
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

  @OneToMany(() => BaseTriggerEntity, (value) => value.story)
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
    } = StoryEntity.resolveForeignKeys({
      flowID,
      status,
      isStart,
      isEnabled,
      assigneeID,
      description,
      triggerOrder,
    }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      flowID: this.flow?.id ?? null,
      assigneeID: this.assignee?.id ?? null,
    };
  }
}
