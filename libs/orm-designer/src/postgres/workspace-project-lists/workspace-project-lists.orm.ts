import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';
import type { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';
import type { MutableEntityData, PKOrEntity } from '@/types';

import { WorkspaceProjectListsEntity } from './workspace-project-lists.entity';

export class WorkspaceProjectListsORM extends PostgresMutableORM(WorkspaceProjectListsEntity) {
  async findOneByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    const [projectLists] = await this.find({ workspace });

    return projectLists;
  }

  async updateOneByWorkspace(
    workspace: PKOrEntity<WorkspaceStubEntity>,
    patch: MutableEntityData<WorkspaceProjectListsEntity>
  ) {
    // TODO: use upsert when we get rid of soft delete in the identity
    const { affectedRows } = await this.em
      .qb(WorkspaceProjectListsEntity)
      .update(patch)
      .where({ workspace, deletedAt: null })
      .execute('run');

    // fake upsert
    if (affectedRows === 0) {
      await this.em.insert(WorkspaceProjectListsEntity, { ...patch, workspace });
    }
  }
}
