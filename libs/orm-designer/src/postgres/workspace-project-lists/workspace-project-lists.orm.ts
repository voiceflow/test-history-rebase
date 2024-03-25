import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';
import type { PatchData } from '@/types';

import { WorkspaceProjectListsEntity } from './workspace-project-lists.entity';
import { WorkspaceProjectListsJSONAdapter } from './workspace-project-lists-json.adapter';

export class WorkspaceProjectListsORM extends PostgresMutableORM<WorkspaceProjectListsEntity> {
  Entity = WorkspaceProjectListsEntity;

  jsonAdapter = WorkspaceProjectListsJSONAdapter;

  async findOneByWorkspace(workspaceID: number) {
    const [projectLists] = await this.find({ workspaceID, deletedAt: null }, { limit: 1 });

    return projectLists;
  }

  // TODO: use upsert when we get rid of soft delete in the identity
  async upsertOneByWorkspace(workspaceID: number, patch: PatchData<WorkspaceProjectListsEntity>) {
    const affectedRows = await this.patch({ workspaceID, deletedAt: null }, patch);

    // fake upsert
    if (affectedRows === 0) {
      await this.createOne({ ...patch, workspaceID });
    }
  }
}
