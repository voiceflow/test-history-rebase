import type { Ref } from '@mikro-orm/core';
import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { PostgresMutableEntity, SoftDelete } from '@/postgres/common';
import { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';

@Entity({ schema: 'app_cxd', tableName: 'workspace_project_lists' })
@SoftDelete()
export class WorkspaceProjectListsEntity extends PostgresMutableEntity<'projectLists' | 'deletedAt'> {
  @OneToOne(() => WorkspaceStubEntity, { name: 'workspace_id', unique: 'workspace_project_lists_workspace_id_idx' })
  workspace!: Ref<WorkspaceStubEntity>;

  @Property({ type: 'text', default: '[]' })
  projectLists!: string;

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
