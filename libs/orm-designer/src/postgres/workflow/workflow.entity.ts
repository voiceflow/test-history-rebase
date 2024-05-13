import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { WorkflowStatus } from '@voiceflow/dtos';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { Ref } from '@/types';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.workflow' })
export class WorkflowEntity extends PostgresCMSTabularEntity<'status' | 'assignee' | 'description'> {
  @Enum({ items: () => WorkflowStatus, default: null, nullable: true })
  status!: WorkflowStatus | null;

  @Property()
  isStart!: boolean;

  @Property({ type: 'varchar', length: 24 })
  diagramID!: string;

  @ManyToOne(() => UserStubEntity, {
    name: 'assignee_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
  })
  assignee!: Ref<UserStubEntity> | null;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
