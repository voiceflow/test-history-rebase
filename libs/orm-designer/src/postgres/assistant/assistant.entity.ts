import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import type { Ref } from '@/types';

import { PostgresCMSObjectEntity } from '../common/entities/postgres-cms-object.entity';
import { WorkspaceStubEntity } from '../stubs/workspace.stub';

@Entity({ tableName: 'designer.assistant' })
@Unique({ properties: ['id'] })
export class AssistantEntity extends PostgresCMSObjectEntity<'activePersona'> {
  @Property()
  name!: string;

  @ManyToOne(() => WorkspaceStubEntity, { name: 'workspace_id', onDelete: 'cascade' })
  workspace!: Ref<WorkspaceStubEntity>;

  @Property({ name: 'active_environment_id', type: 'varchar', length: 24 })
  activeEnvironmentID!: string;
}
