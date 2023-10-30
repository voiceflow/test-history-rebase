import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter, ref } from '@/postgres/common';
import { WorkspaceStubEntity } from '@/postgres/stubs/workspace.stub';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { WorkspaceProjectListsEntity } from './workspace-project-lists.entity';

export const WorkspaceProjectListsJSONAdapter = createSmartMultiAdapter<
  EntityObject<WorkspaceProjectListsEntity>,
  ToJSONWithForeignKeys<WorkspaceProjectListsEntity>,
  [],
  [],
  [['workspace', 'workspaceID']]
>(
  ({ workspace, deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),

    ...(workspace !== undefined && { workspaceID: workspace.id }),
  }),
  ({ workspaceID, deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),

    ...(workspaceID !== undefined && { workspace: ref(WorkspaceStubEntity, workspaceID) }),
  })
);
