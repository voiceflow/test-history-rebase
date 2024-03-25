import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';

import type { WorkspaceProjectListsJSON, WorkspaceProjectListsObject } from './workspace-project-lists.interface';

export const WorkspaceProjectListsJSONAdapter = createSmartMultiAdapter<
  WorkspaceProjectListsObject,
  WorkspaceProjectListsJSON
>(
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
