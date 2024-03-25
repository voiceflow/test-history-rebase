import { ArrayType, Entity, Enum, Index, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { StoryStatus } from '@voiceflow/dtos';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { Ref } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowEntity } from '../flow';

@Entity({ tableName: 'designer.story' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class StoryEntity extends PostgresCMSTabularEntity<'flow' | 'status' | 'assignee' | 'description'> {
  @Enum({ items: () => StoryStatus, default: null, nullable: true })
  status!: StoryStatus | null;

  @ManyToOne(() => FlowEntity, {
    name: 'flow_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['flow_id', 'environment_id'],
  })
  flow!: Ref<FlowEntity> | null;

  @Property()
  isStart!: boolean;

  @Property()
  isEnabled!: boolean;

  @ManyToOne(() => UserStubEntity, {
    name: 'assignee_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
  })
  assignee!: Ref<UserStubEntity> | null;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Property({ type: ArrayType })
  triggerOrder!: string[];
}
