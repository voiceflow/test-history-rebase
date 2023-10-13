import type { Ref } from '@mikro-orm/core';
import { Entity, Index, OneToOne, PrimaryKey, Property, ref, wrap } from '@mikro-orm/core';

import { PostgresAbstractEntity, SoftDelete } from '@/postgres/common';
import { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';
import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

@Entity({ schema: 'app_cxd', tableName: 'workspace_project_lists' })
@SoftDelete()
export class WorkspaceProjectListsEntity extends PostgresAbstractEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<WorkspaceProjectListsEntity>>({
    workspaceID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(workspaceID !== undefined && { workspace: ref(WorkspaceStubEntity, workspaceID) }),
    } as ResolvedForeignKeys<WorkspaceProjectListsEntity, Data>;
  }

  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number;

  @Index({ name: 'workspace_project_lists_updated_at_idx' })
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date(), type: 'timestamptz' })
  updatedAt: Date = new Date();

  @Index({ name: 'workspace_project_lists_deleted_at_idx' })
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  @OneToOne(() => WorkspaceStubEntity, { name: 'workspace_id', unique: 'workspace_project_lists_workspace_id_idx' })
  workspace: Ref<WorkspaceStubEntity>;

  @Property({ type: 'text', default: '[]' })
  projectLists = JSON.stringify([]);

  constructor(data: EntityCreateParams<WorkspaceProjectListsEntity>) {
    super();

    ({ workspace: this.workspace, projectLists: this.projectLists } = WorkspaceProjectListsEntity.resolveForeignKeys({
      ...data,
      projectLists: JSON.stringify(data.projectLists),
    }));
  }

  toJSON(...args: any[]) {
    return {
      ...wrap(this).toObject(...args),
      workspaceID: this.workspace.id,
    };
  }
}
