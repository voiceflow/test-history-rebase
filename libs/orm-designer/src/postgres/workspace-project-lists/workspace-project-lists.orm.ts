import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';
import type { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';
import type { MutableEntityData, PKOrEntity } from '@/types';

import { WorkspaceProjectListsEntity } from './workspace-project-lists.entity';

export class WorkspaceProjectListsORM extends PostgresMutableORM(WorkspaceProjectListsEntity) {
  async findOneByWorkspaceOrFail(workspace: PKOrEntity<WorkspaceStubEntity>) {
    const [projectLists] = await this.find({ workspace });

    if (!projectLists) {
      throw new Error('workspace project lists not found');
    }

    return projectLists;
  }

  async updateOneByWorkspace(
    workspace: PKOrEntity<WorkspaceStubEntity>,
    patch: MutableEntityData<WorkspaceProjectListsEntity>
  ) {
    return this.em.upsert(
      WorkspaceProjectListsEntity,
      { ...patch, workspace },
      { onConflictFields: ['workspace', 'deletedAt'] }
    );
  }
}
