import type { Ref } from '@mikro-orm/core';
import { Entity, OneToOne, Property, wrap } from '@mikro-orm/core';

import { PostgresMutableEntity, SoftDelete } from '@/postgres/common';
import { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { WorkspaceProjectListsEntityAdapter } from './workspace-project-lists-entity.adapter';

@Entity({ schema: 'app_cxd', tableName: 'workspace_project_lists' })
@SoftDelete()
export class WorkspaceProjectListsEntity extends PostgresMutableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<WorkspaceProjectListsEntity>>>(data: JSON) {
    return WorkspaceProjectListsEntityAdapter.toDB<JSON>(data);
  }

  @OneToOne(() => WorkspaceStubEntity, { name: 'workspace_id', unique: 'workspace_project_lists_workspace_id_idx' })
  workspace: Ref<WorkspaceStubEntity>;

  @Property({ type: 'text', default: '[]' })
  projectLists = JSON.stringify([]);

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  constructor(data: EntityCreateParams<WorkspaceProjectListsEntity>) {
    super();

    ({ workspace: this.workspace, projectLists: this.projectLists } = WorkspaceProjectListsEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<WorkspaceProjectListsEntity> {
    return WorkspaceProjectListsEntityAdapter.fromDB({
      ...wrap<WorkspaceProjectListsEntity>(this).toObject(...args),
      workspace: this.workspace,
    });
  }
}
